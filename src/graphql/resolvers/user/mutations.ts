import { Container } from 'typedi';
import { ApolloError } from 'apollo-server-express';

import logger from '../../../utils/logger';
import { UserCreationDTO, UserService } from '../../../services/UserService';
import { Optional } from '../../../utils/types';
import { User } from '../../../models/User';

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
      logger.error({
        label: 'FindUser',
        message: error.message
      });

      throw new ApolloError('Internal server error');
    }
  }
};

export default userMutations;
