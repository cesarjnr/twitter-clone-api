// import { Container } from 'typedi';
// import { RedisClient } from 'redis';

// const typediLoader = async (redisClient: RedisClient): Promise<void> => {
//   Container.set('redisClient', redisClient);
//   await import('../services/redis.service');
//   await import('../services/tweet.service');
//   await import('../controllers/tweet.controller');
// };

// export default typediLoader;