import 'reflect-metadata';
import express, { Express } from 'express';
import { createConnection } from 'typeorm';

import config from './config';
import logger from './utils/logger';
import { importDatabaseDataToRedis } from './scripts/importDatabaseDataToRedis';

class Application {
  static app: Express;

  static async init(): Promise<void> {
    try {
      this.app = express();

      await createConnection();
      await import('./dependencies');
      // await this.runScripts();
      await this.startGraphQlServer();

      this.app.listen(config.common.port);

      logger.info({
        label: 'StartApplication',
        message: `Application started on port ${config.common.port}`
      });
    } catch (error) {
      logger.error({
        label: 'StartApplication',
        message: error
      });
    }
  }

  static async startGraphQlServer(): Promise<void> {
    const graphqlServer = (await import('./graphql')).default;

    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app: this.app });
  }

  static async runScripts(): Promise<void> {
    if (process.env.ENV === 'development') {
      await importDatabaseDataToRedis();
    }
  }
}

Application.init();
