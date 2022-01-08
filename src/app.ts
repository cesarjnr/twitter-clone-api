import 'reflect-metadata';
import express, { Express, json } from 'express';
import { createConnection } from 'typeorm';

import './config';
// import Routes from './routes';
import graphqlServer from './graphql';
import { importDatabaseDataToRedis } from './scripts/importDatabaseDataToRedis';

class Application {
  public express: Express;

  public constructor() {
    this.express = express();
  }

  public async init(): Promise<void> {
    // await createConnection();

    // require('./dependencies');

    // await this.runScripts();

    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app: this.express });

    // this.express.use(json());
    // this.express.use(Routes.setRoutes());
  }

  private async runScripts(): Promise<void> {
    if (process.env.ENV === 'development') {
      await importDatabaseDataToRedis();
    }
  }
}

export default Application;
