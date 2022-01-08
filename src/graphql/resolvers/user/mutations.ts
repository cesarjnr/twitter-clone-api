import { Container } from 'typedi';

import { UserCreationDTO, UserService } from '../../../services/UserService';
import { User } from '../../../models/User';

const userMutations = {
  createUser: async (
    _: any,
    { user }: { user: UserCreationDTO }
  ): Promise<Omit<User, 'password'>> => {
    const userService = Container.get<UserService>('userService');
    let newUser = await userService.create(user);
    newUser = Object.assign(newUser, { password: undefined });

    return newUser;
  }
};

export default userMutations;
