import { RedisClient, createClient, Callback } from 'redis';
import { redisConfig } from '../configs';
import { HitDto } from './types';

const popHitBlocking = (client: RedisClient): Promise<HitDto> => {
  const hitsQueueName = 'hits';
  return new Promise<HitDto>((resolve, reject) => {
    const callback: Callback<[string, string]> = (err, reply) => {
      if (err) {
        reject(err);
      } else {
        const [, value] = reply;
        resolve(JSON.parse(value));
      }
    };

    client.blpop(hitsQueueName, 0, callback);
  });
};

const connect = (): RedisClient => {
  const client = createClient({
    host: redisConfig.host,
    port: redisConfig.port,
  });

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  client.on('connect', () => {
    console.error('Connected to redis instance.');
  });

  return client;
};

const disconnect = async (redisClient: RedisClient): Promise<void> => {
  try {
    redisClient.end(true);
    redisClient.quit((err, reply) => {
      if (err) {
        console.error('Error while disconnection from redis:', err);
      }

      console.log(`Redis disconnect reply '${reply}'`);
    });
  } catch (err) {
    console.error('Error while disconnection from redis:', err);
  }
};

export { popHitBlocking, connect, disconnect };
