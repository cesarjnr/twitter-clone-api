import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';

import { UserService } from '../services/UserService';

@Service('userController')
export class UserController {
  private userService: UserService

  public constructor(
    @Inject('userService') userService: UserService
  ) {
    this.userService = userService;
  }
  
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body);

      res.status(201).json(user);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again in a few minutes!'
      });
    }
  }
}
