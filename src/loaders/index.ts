import { Container } from 'typedi';

import { app } from './fastify';
import { redisClient } from './redis';

Container.set('redisClient', redisClient);

export { app };
