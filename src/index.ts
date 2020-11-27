//import mongoose from 'mongoose';
import { connect as connectDb, UrlModel } from './db';
import { connect as connectRedis, popHitBlocking } from './redis';

export const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

const main = async () => {
  await connectDb();
  const redisClient = connectRedis();

  for (;;) {
    try {
      console.log('Waiting for hit to process....');
      const hitDto = await popHitBlocking();
      console.log(`Recieved hit on path '${hitDto.path}'.`);

      await UrlModel.updateOne({ path: hitDto.path }, { $inc: { hitCount: 1 } }).exec();
    } catch (err: any) {
      console.error(err);
    }

    if (!redisClient.connected) await delay(1500);
  }
};

main().catch((err) => {
  console.error(err);
});
