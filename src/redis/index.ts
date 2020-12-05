import { RedisClient, createClient, Callback } from 'redis';
import { redisConfig } from '../configs';
import { HitDto } from './types';

const hitsQueueName = 'hits';

const connect = (): RedisClient => {
  const client = createClient({
    host: redisConfig.host,
    port: redisConfig.port,
  });

  client.on('error', function (err) {
    console.error('Redis error:', err);
  });

  client.on('connect', function () {
    console.error('Connected to redis instance.');
  });

  return client;
};

const popHitBlocking = (client: RedisClient): Promise<HitDto> => {
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

export { popHitBlocking, connect };
