import faker from 'faker';
import { EntityNotFoundError } from 'typeorm';

import userQueries from '../../../../src/graphql/resolvers/user/queries';
import { UserService } from '../../../../src/services/UserService';
import { Container } from 'typedi';
import { User } from "../../../../src/models/User";
import { ApolloError } from 'apollo-server-express';

jest.mock('../../../../src/services/UserService');
jest.mock('../../../../src/utils/logger');

describe('userQueries', () => {
  const mockUserService = {} as jest.Mocked<UserService>;

  beforeEach(() => {
    Container.get = jest.fn().mockReturnValue(mockUserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findUser', () => {
    const userId = faker.datatype.number(100);

    it('Should find a user', async () => {
      const user = new User(
        faker.name.findName(),
        faker.internet.password(),
        '2022-01-19',
        faker.internet.userName(),
        faker.internet.email()
      );

      user.id = faker.datatype.number(100);
      user.createdAt = faker.date.past();
      mockUserService.find = jest.fn().mockResolvedValue(user);

      const foundUser = await userQueries.findUser({}, { id: userId });

      expect(foundUser).toStrictEqual({
        id: user.id,
        name: user.name,
        dateOfBirth: '2022-01-19',
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        phone: undefined
      });
      expect(mockUserService.find).toHaveBeenCalledWith(userId);
    });

    it('Should catch an EntityNotFoundError exception and throw the ApolloError exception with the message "User not found"', async () => {
      const thrownError = new ApolloError('User not found');

      mockUserService.find = jest.fn().mockRejectedValue(new EntityNotFoundError(User, {}));

      await expect(userQueries.findUser({}, { id: userId })).rejects.toStrictEqual(thrownError);
      expect(mockUserService.find).toHaveBeenCalledWith(userId);
    });

    it('Should catch some exception and throw the ApolloError exception with the message "Internal server error"', async () => {
      const thrownError = new ApolloError('Internal server error');

      mockUserService.find = jest.fn().mockRejectedValue(new Error('Some error message'));

      await expect(userQueries.findUser({}, { id: userId })).rejects.toStrictEqual(thrownError);
      expect(mockUserService.find).toHaveBeenCalledWith(userId);
    });
  });
});
