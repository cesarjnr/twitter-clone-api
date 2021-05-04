import 'reflect-metadata';
import express, { Express, json } from 'express';
import { createConnection } from 'typeorm';

import Routes from './routes';

class Application {
  public express: Express;

  public constructor() {
    this.express = express();
  }

  public async init(): Promise<void> {
    await createConnection();

    require('./dependencies');

    this.express.use(json());
    this.express.use(Routes.setRoutes());
  }
}

export default Application;
