import faker from 'faker';
import { EntityManager, Repository } from 'typeorm';

import { User } from '../../src/models/User';
import { CacheService } from '../../src/interfaces/CacheService';
import { UserService, UserCreationDTO } from '../../src/services/UserService';

describe('UserService', () => {
  const mockUserRepository = { manager: {} } as jest.Mocked<Repository<User>>;
  const mockCacheService = {} as jest.Mocked<CacheService>;
  const userService = new UserService(mockUserRepository, mockCacheService);

  afterEach(() => {
    jest.resetAllMocks();
  });

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

  describe('find', () => {
    const userId = faker.datatype.number(100);

    it('Should find a user in cache', async () => {
      const user = {
        id: `${userId}`,
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        dateOfBirth: `${faker.date.past().getTime()}`,
        username: faker.internet.userName(),
        createdAt: `${faker.date.past().getTime()}`,
        disabledAt: `${faker.date.past().getTime()}`
      };

      mockCacheService.getHash = jest.fn().mockResolvedValue(user);
      mockUserRepository.findOneOrFail = jest.fn();

      const foundUser = await userService.find(userId);

      expect(foundUser).toStrictEqual({
        ...user,
        id: Number(user.id),
        dateOfBirth: new Date(Number(user.dateOfBirth)),
        createdAt: new Date(Number(user.createdAt)),
        disabledAt: new Date(Number(user.disabledAt))
      });
      expect(mockCacheService.getHash).toHaveBeenCalledWith(`user:${userId}:data`);
      expect(mockUserRepository.findOneOrFail).not.toHaveBeenCalled();
    });

    it('Should find a user in database', async () => {
      const user = new User(
        faker.name.findName(),
        faker.internet.password(),
        '2022-01-19',
        faker.internet.userName(),
        faker.internet.email()
      );

      user.id = userId;
      user.createdAt = faker.date.past();
      user.disabledAt = faker.date.past();
      mockCacheService.getHash = jest.fn().mockResolvedValue(null);
      mockUserRepository.findOneOrFail = jest.fn().mockResolvedValue(user);

      const foundUser = await userService.find(userId);

      expect(foundUser).toStrictEqual(user);
      expect(mockCacheService.getHash).toHaveBeenCalledWith(`user:${userId}:data`);
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith(userId);
    });
  });
});
