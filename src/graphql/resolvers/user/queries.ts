import { Container } from 'typedi';
import { format } from 'date-fns';

import { User } from '../../../models/User';
import { UserService } from '../../../services/UserService';

const userQueries = {
  findUser: async(
    _: any,
    { id }: { id: number }
  ): Promise<Omit<User, 'password'>> => {
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
  }
};

export default userQueries;
