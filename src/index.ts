import mongoose from 'mongoose';
import { RedisClient } from 'redis';
import { connect as connectDb, disconnect as disconnectDb } from './db';
import { connect as connectRedis, disconnect as disconnectRedis, popHitBlocking } from './redis';
import { UrlDoc } from './db/url';

let exiting = false;

const runLoop = async (redisClient: RedisClient, urlModel: mongoose.Model<UrlDoc, Record<string, never>>): Promise<void> => {
  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

  while (!exiting) {
    try {
      console.log('Waiting for hit to process....');
      const hitDto = await popHitBlocking(redisClient);
      console.log(`Recieved hit on path '${hitDto.path}'.`);

      await urlModel.updateOne({ path: hitDto.path }, { $inc: { hitCount: 1 } }).exec();
    } catch (err) {
      console.error(err);
    }

    if (!redisClient.connected) {
      await delay(1500);
    }
  }
};

const main = async () => {
  const { UrlModel } = await connectDb();
  const redisClient = connectRedis();

  const shutdown = async () => {
    exiting = true;

    await disconnectRedis(redisClient);
    await disconnectDb();

    process.exit();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await runLoop(redisClient, UrlModel);
};

main().catch((err) => {
  console.error(err);
});
