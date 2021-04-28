import { Express, json } from 'express';

import databaseLoader from './database';
import typediLoader from './typedi';

const init = async (app: Express): Promise<void> => {
  databaseLoader();
  typediLoader();
  app.use(json());
}

export default init;
