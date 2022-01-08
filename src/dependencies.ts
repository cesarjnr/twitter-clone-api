import redis from 'redis';
import { Container } from 'typedi';
import { getRepository } from 'typeorm';

import './services/RedisService';
import './services/UserService';
import './controllers/UserController';
import config from './config';
import { User } from './models/User';

Container.set('userRepository', getRepository(User));
Container.set('redisClient', redis.createClient({
  host: config.redis.host,
  port: config.redis.port
}));
