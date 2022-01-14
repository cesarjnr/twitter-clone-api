import faker from 'faker';
import { EntityManager, Repository } from 'typeorm';

import { User } from '../../src/models/User';
import { CacheService } from '../../src/interfaces/CacheService';
import { UserService, UserCreationDTO } from '../../src/services/UserService';

describe('UserService', () => {
  const mockUserRepository = { manager: {} } as jest.Mocked<Repository<User>>;
  const mockCacheService = {} as jest.Mocked<CacheService>;
  const userService = new UserService(mockUserRepository, mockCacheService);

  describe('create', () => {
    it('Should create a user', async () => {
      const userCreationDto: UserCreationDTO = {
        name: faker.name.findName(),
        password: faker.internet.password(),
        dateOfBirth: '1996-01-08',
        username: faker.internet.userName(),
        email: faker.internet.email()
      };
      const userId = faker.datatype.number(100);
      const userCreatedAt = faker.date.recent();

      mockUserRepository.manager.save = jest
        .fn()
        .mockImplementation((user: User) => ({ ...user, id: userId, createdAt: userCreatedAt }));
      mockUserRepository.manager.transaction = jest
        .fn()
        .mockImplementation((callback: (entityManager: EntityManager) => Promise<void>) => {
          callback(mockUserRepository.manager);
        });
      mockCacheService.setHash = jest.fn();

      const newUser = await userService.create(userCreationDto);

      expect(newUser).toEqual({
        id: userId,
        name: userCreationDto.name,
        email: userCreationDto.email,
        phone: undefined,
        password: userCreationDto.password,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username,
        createdAt: userCreatedAt
      });
      expect(mockUserRepository.manager.transaction).toHaveBeenCalled();
      expect(mockUserRepository.manager.save).toHaveBeenCalledWith({
        name: userCreationDto.name,
        email: userCreationDto.email,
        phone: undefined,
        password: userCreationDto.password,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username
      });
      expect(mockCacheService.setHash).toHaveBeenCalledWith(
        `user:${userId}:data`,
        {
          ...userCreationDto,
          id: userId,
          dateOfBirth: new Date(userCreationDto.dateOfBirth).getTime(),
          createdAt: userCreatedAt.getTime()
        }
      );
    });
  });
});
