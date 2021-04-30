import { Express, json } from 'express';

import routes from '../routes';

const expressLoader = (app: Express) => {
  app.use(json());
  app.use(routes);
};

export default expressLoader;
