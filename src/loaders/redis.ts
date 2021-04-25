import redis from 'redis';

import config from '../config';

const redisClientLoader = (): redis.RedisClient => {
  return redis.createClient({
    host: config.redis.host,
    port: config.redis.port
  });
}

export default redisClientLoader;
