import { Express } from 'express';
import { Container } from 'typedi';

import requestValidator from './middlewares/requestValidator';
import { UserController } from './controllers/UserController';

const routes = (app: Express): void => {
  const userController = Container.get<UserController>('userController');

  app.post('/users', requestValidator, userController.create.bind(userController));
};

export default routes;
