import { Container } from 'typedi';

import { UserCreationDTO, UserService } from '../../../services/UserService';
import { Optional } from '../../../utils/types';
import { User } from '../../../models/User';
import { handleError } from '../../../utils/error';

const userMutations = {
  createUser: async (
    _: any,
    { user }: { user: UserCreationDTO }
  ): Promise<Optional<User, 'password'> | undefined> => {
    try {
    const userService = Container.get<UserService>('userService');
    const newUser = await userService.create(user);

    Object.assign(newUser, { password: undefined });

    return newUser;
    } catch (error: any) {
      handleError('CreateUser', error);
    }
  }
};

export default userMutations;
