import mongoose from 'mongoose';
import { RedisClient } from 'redis';
import { connect as connectDb } from './db';
import { UrlDoc } from './db/url';
import { connect as connectRedis, popHitBlocking } from './redis';

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
    redisClient.quit();
    await mongoose.disconnect();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await runLoop(redisClient, UrlModel);
};

main().catch((err) => {
  console.error(err);
});
