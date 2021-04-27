import { Express, json } from 'express';

import databaseLoader from './database';
// import redisClientLoader from './redis';
import typediLoader from './typedi';
import routesLoader from './routes';

const init = async (app: Express): Promise<void> => {
  // const redisClient = redisClientLoader();

  databaseLoader();
  app.use(json());
  await typediLoader(/* redisClient */);
  routesLoader(app);
}

export default init;
