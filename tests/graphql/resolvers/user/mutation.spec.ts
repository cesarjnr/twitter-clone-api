import faker from 'faker';
import { Container } from 'typedi';

import { UserService, UserCreationDTO } from '../../../../src/services/UserService';
import { User } from "../../../../src/models/User";
import userMutations from '../../../../src/graphql/resolvers/user/mutations';

jest.mock('../../../../src/services/UserService');

describe('userMutations', () => {
  describe('createUser', () => {
    it('Should create a user', async () => {
      const userCreationDTO: UserCreationDTO = {
        name: faker.name.findName(),
        password: faker.internet.password(),
        dateOfBirth: '1996-01-08',
        username: faker.internet.userName(),
        email: faker.internet.email()
      };
      const createdUser = new User(
        userCreationDTO.name,
        userCreationDTO.password,
        userCreationDTO.dateOfBirth,
        userCreationDTO.username,
        userCreationDTO.email
      );
      const mockUserService = {} as jest.Mocked<UserService>;

      mockUserService.create = jest.fn().mockResolvedValue(createdUser);
      Container.get = jest.fn().mockReturnValue(mockUserService);

      const newUser = await userMutations.createUser({}, { user: userCreationDTO });

      expect(newUser).toStrictEqual({ ...createdUser, password: undefined });
      expect(Container.get).toHaveBeenCalled();
      expect(mockUserService.create).toHaveBeenCalledWith(userCreationDTO);
    });
  });
});
