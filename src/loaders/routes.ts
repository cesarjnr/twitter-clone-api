import Container from 'typedi';
import { Express } from 'express';

import { UserController } from '../controllers/UserController';

const routesLoader = (app: Express): void => {
  const userController = Container.get<UserController>('userController');

  app.post('/users', userController.create.bind(userController));
};

export default routesLoader;
