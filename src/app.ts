import 'reflect-metadata';
import express, { Express, json } from 'express';
import { createConnection } from 'typeorm';

import './config';
import Routes from './routes';
import { importDatabaseDataToRedis } from './scripts/importDatabaseDataToRedis';

class Application {
  public express: Express;

  public constructor() {
    this.express = express();
  }

  public async init(): Promise<void> {
    await createConnection();

    require('./dependencies');

    await this.runScripts();
    this.express.use(json());
    this.express.use(Routes.setRoutes());
  }

  private async runScripts(): Promise<void> {
    if (process.env.ENV === 'dev') {
      await importDatabaseDataToRedis();
    }
  }
}

export default Application;
