import { Container } from 'typedi';
import { format } from 'date-fns';
import { EntityNotFoundError } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import logger from '../../../utils/logger';
import { User } from '../../../models/User';
import { UserService } from '../../../services/UserService';
import { ENTITY_NOT_FOUND } from '../errorCodes';

const userQueries = {
  findUser: async(
    _: any,
    { id }: { id: number }
  ): Promise<Omit<User, 'password'> | void> => {
    try {
      const userService = Container.get<UserService>('userService');
      let user = await userService.find(id);
      user = Object.assign(
        user,
        {
          password: undefined,
          dateOfBirth: format(user.dateOfBirth, 'yyyy-MM-dd')
        }
      );

      return user;
    } catch (error: any) {
      logger.error({
        label: 'FindUser',
        message: error.message
      });

      let errorMessage = 'Internal server error';

      if (error instanceof EntityNotFoundError) {
        errorMessage = 'User not found'
      }

      throw new ApolloError(errorMessage, ENTITY_NOT_FOUND);
    }
  }
};

export default userQueries;
