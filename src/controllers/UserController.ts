import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';

import { UserService } from '../services/UserService';

@Service('userController')
export class UserController {
  private userService: UserService;

  public constructor(
    @Inject('userService') userService: UserService
  ) {
    this.userService = userService;
  }

  public async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.create(req.body);

    res.json(user);
  }
}
