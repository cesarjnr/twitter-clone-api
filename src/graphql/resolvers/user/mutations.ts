import { Container } from 'typedi';
import { ApolloError } from 'apollo-server-express';

import logger from '../../../utils/logger';
import { UserCreationDTO, UserService } from '../../../services/UserService';
import { User } from '../../../models/User';

const userMutations = {
  createUser: async (
    _: any,
    { user }: { user: UserCreationDTO }
  ): Promise<Omit<User, 'password'> | void> => {
    try {
    const userService = Container.get<UserService>('userService');
    let newUser = await userService.create(user);
    newUser = Object.assign({}, newUser, { password: undefined });

    return newUser;
    } catch (error: any) {
      logger.error({
        label: 'FindUser',
        message: error.message
      });

      new ApolloError('Internal server error');
    }
  }
};

export default userMutations;
