import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';

import config from './config';
import graphqlServer from './graphql';
import { importDatabaseDataToRedis } from './scripts/importDatabaseDataToRedis';

class Application {
  static async init(): Promise<void> {
    try {
      const app = express();

      await createConnection();

      require('./dependencies');

      // await this.runScripts();
      await graphqlServer.start();
      
      graphqlServer.applyMiddleware({ app });
      app.listen(config.common.port)
      console.log(`Application started on port ${config.common.port}`);
    } catch (error) {
      console.error(`An error occured: ${error}`);
    }
  }

  private async runScripts(): Promise<void> {
    if (process.env.ENV === 'development') {
      await importDatabaseDataToRedis();
    }
  }
}

Application.init();
