import 'reflect-metadata';
import express from 'express';

import './config';
import init from './loaders';

const startServer = async () => {
  const app = express();

  try {
    await init(app);
    app.listen(3000);
    console.log('App running on port 3000...');
  } catch (err) {
    console.log(`Fatal error: ${err}`);
    process.exit(1);
  }
};

startServer();
