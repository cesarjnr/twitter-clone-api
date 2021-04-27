import { Service } from "typedi";

import { User } from "../models/User";

interface CreateUserDTO {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  dateOfBirth: Date;
  username: string;
}

@Service('userService')
export class UserService {
  public async create(userData: CreateUserDTO): Promise<User> {
    const user = await User.query().insert({ ...userData });

    return user;
  }
}
