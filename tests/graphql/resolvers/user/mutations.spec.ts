import faker from 'faker';
import { Container } from 'typedi';
import { ApolloError } from 'apollo-server-express';

import { UserService, UserCreationDTO } from '../../../../src/services/UserService';
import { User } from "../../../../src/models/User";
import userMutations from '../../../../src/graphql/resolvers/user/mutations';

jest.mock('../../../../src/services/UserService');
jest.mock('../../../../src/utils/logger');

describe('userMutations', () => {
  const mockUserService = {} as jest.Mocked<UserService>;

  beforeEach(() => {
    Container.get = jest.fn().mockReturnValue(mockUserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    const userCreationDTO: UserCreationDTO = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      dateOfBirth: '1996-01-08',
      username: faker.internet.userName(),
      email: faker.internet.email()
    };

    it('Should create a user', async () => {
      const createdUser = new User(
        userCreationDTO.name,
        userCreationDTO.password,
        userCreationDTO.dateOfBirth,
        userCreationDTO.username,
        userCreationDTO.email
      );

      mockUserService.create = jest.fn().mockResolvedValue(createdUser);

      const newUser = await userMutations.createUser({}, { user: userCreationDTO });

      expect(newUser).toStrictEqual(createdUser);
      expect(newUser!.password).toBeUndefined();
      expect(Container.get).toHaveBeenCalled();
      expect(mockUserService.create).toHaveBeenCalledWith(userCreationDTO);
    });

    it('Should catch some exception and throw the ApolloError exception with the message "Internal server error"', async () => {
      const thrownError = new ApolloError('Internal server error');

      mockUserService.create = jest.fn().mockRejectedValue(new Error('Some error message'));

      await expect(userMutations.createUser({}, { user: userCreationDTO })).rejects.toStrictEqual(thrownError);
      expect(mockUserService.create).toHaveBeenCalledWith(userCreationDTO);
    });
  });
});
