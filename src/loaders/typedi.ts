import { Container } from 'typedi';
// import { RedisClient } from 'redis';

import '../services/UserService';
import '../controllers/UserController';

const typediLoader = (/* redisClient: RedisClient */): void => {
  // Container.set('redisClient', redisClient);
};

export default typediLoader;
