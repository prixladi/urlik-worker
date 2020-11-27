import mongoConfig from './mongoConfig';
import redisConfig from './redisConfig';

const devEnvironment = process.env.NODE_ENV === 'development';

export { devEnvironment };
export { mongoConfig, redisConfig };
