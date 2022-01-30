import { Container } from 'typedi';

import { User } from '../../../models/User';
import { Optional } from '../../../utils/types';
import { UserService } from '../../../services/UserService';
import { formatUTCDate } from '../../../utils/date';
import { handleError } from '../../../utils/error';

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
      handleError('FindUser', error);
    }
  }
};

export default userQueries;
