import { Express } from 'express';
import { Model } from 'objection';

import './typedi';
import databaseLoader from './database';
import expressLoader from './express';

const init = async (app: Express): Promise<void> => {
  const dbInstance = databaseLoader();

  Model.knex(dbInstance);
  expressLoader(app);
}

export default init;
