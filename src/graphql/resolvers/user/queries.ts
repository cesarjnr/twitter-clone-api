import { Container } from 'typedi';
import { EntityNotFoundError } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import logger from '../../../utils/logger';
import { User } from '../../../models/User';
import { Optional } from '../../../utils/types';
import { UserService } from '../../../services/UserService';
import { formatUTCDate } from '../../../utils/date';
import { ENTITY_NOT_FOUND } from '../errorCodes';

type FindUserDTO = Omit<Optional<User, 'password'>, 'dateOfBirth'> & { dateOfBirth: string };

const userQueries = {
  findUser: async(
    _: any,
    { id }: { id: number }
  ): Promise<FindUserDTO | void> => {
    try {
      const userService = Container.get<UserService>('userService');
      const { password, dateOfBirth, ...rest } = await userService.find(id);

      return {
        ...rest,
        dateOfBirth: formatUTCDate(dateOfBirth)
      }
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
