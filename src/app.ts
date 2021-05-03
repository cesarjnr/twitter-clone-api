import 'reflect-metadata';
import express, { Express, json } from 'express';
import { createConnection } from 'typeorm';

import routes from './routes';

class Application {
  public express: Express;

  public constructor() {
    this.express = express();
  }

  public async init(): Promise<void> {
    await createConnection();

    require('./dependencies');

    this.express.use(json());

    routes(this.express);
  }
}

export default Application;
