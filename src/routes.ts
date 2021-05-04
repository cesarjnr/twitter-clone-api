import { Router } from 'express';
import { Container } from 'typedi';

import requestValidator from './middlewares/requestValidator';
import { UserController } from './controllers/UserController';

class Routes {
  static setRoutes(): Router {
    const routes = Router();
    const userController = Container.get<UserController>('userController');

    routes.post('/users', requestValidator, userController.create.bind(userController));

    return routes;
  }
}

export default Routes;
