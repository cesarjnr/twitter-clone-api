import faker from 'faker';
import { EntityManager, Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from '../../src/models/User';
import { CacheService } from '../../src/interfaces/CacheService';
import { UserService, UserCreationDTO } from '../../src/services/UserService';
import { EntityNotFoundError, ConflictError } from '../../src/utils/error';

jest.mock('bcrypt');

describe('UserService', () => {
  const mockUserRepository = { manager: {} } as jest.Mocked<Repository<User>>;
  const mockCacheService = {} as jest.Mocked<CacheService>;
  const userService = new UserService(mockUserRepository, mockCacheService);
  const mockHash = hash as jest.MockedFunction<typeof hash>;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const userCreationDto: UserCreationDTO = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      dateOfBirth: '1996-01-08',
      username: faker.internet.userName()
    };
    const passwordHash = faker.git.commitSha();
    const userId = faker.datatype.number(100);
    const userCreatedAt = faker.date.recent();

    beforeEach(() => {
      mockUserRepository.findOne = jest.fn();
      mockHash.mockImplementation(() => Promise.resolve(passwordHash));
      mockUserRepository.manager.save = jest
        .fn()
        .mockImplementation((user: User) => ({ ...user, id: userId, createdAt: userCreatedAt }));
      mockUserRepository.manager.transaction = jest
        .fn()
        .mockImplementation((callback: (entityManager: EntityManager) => Promise<void>) => {
          callback(mockUserRepository.manager);
        });
      mockCacheService.setHash = jest.fn();
    });

    it('Should create a user passing an email', async () => {
      const email = faker.internet.email();

      const newUser = await userService.create({ ...userCreationDto, email });

      expect(newUser).toEqual({
        id: userId,
        name: userCreationDto.name,
        email,
        phone: undefined,
        password: passwordHash,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username,
        createdAt: userCreatedAt
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email });
      expect(mockHash).toHaveBeenCalledWith(userCreationDto.password, 10);
      expect(mockUserRepository.manager.transaction).toHaveBeenCalled();
      expect(mockUserRepository.manager.save).toHaveBeenCalledWith({
        name: userCreationDto.name,
        email,
        phone: undefined,
        password: passwordHash,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username
      });
      expect(mockCacheService.setHash).toHaveBeenCalledWith(
        `user:${userId}:data`,
        {
          ...userCreationDto,
          email,
          password: passwordHash,
          id: userId,
          dateOfBirth: new Date(userCreationDto.dateOfBirth).getTime(),
          createdAt: userCreatedAt.getTime()
        }
      );
    });

    it('Should create a user passing a phone', async () => {
      const phone = faker.phone.phoneNumber();

      const newUser = await userService.create({ ...userCreationDto, phone });

      expect(newUser).toEqual({
        id: userId,
        name: userCreationDto.name,
        email: undefined,
        phone,
        password: passwordHash,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username,
        createdAt: userCreatedAt
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ phone });
      expect(mockHash).toHaveBeenCalledWith(userCreationDto.password, 10);
      expect(mockUserRepository.manager.transaction).toHaveBeenCalled();
      expect(mockUserRepository.manager.save).toHaveBeenCalledWith({
        name: userCreationDto.name,
        email: undefined,
        phone,
        password: passwordHash,
        dateOfBirth: new Date(userCreationDto.dateOfBirth),
        username: userCreationDto.username
      });
      expect(mockCacheService.setHash).toHaveBeenCalledWith(
        `user:${userId}:data`,
        {
          ...userCreationDto,
          phone,
          password: passwordHash,
          id: userId,
          dateOfBirth: new Date(userCreationDto.dateOfBirth).getTime(),
          createdAt: userCreatedAt.getTime()
        }
      );
    });

    it('Should throw the ConflictError exception if there is already a user for the given email', async () => {
      const thrownError = new ConflictError('Email already used');
      const email = faker.internet.email();
      const foundUser = { email } as User;

      mockUserRepository.findOne = jest.fn().mockResolvedValue(foundUser);

      await expect(userService.create({ ...userCreationDto, email })).rejects.toStrictEqual(thrownError);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email });
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockUserRepository.manager.transaction).not.toHaveBeenCalled();
      expect(mockUserRepository.manager.save).not.toHaveBeenCalled();
      expect(mockCacheService.setHash).not.toHaveBeenCalled();
    });

    it('Should throw the ConflictError exception if there is already a user for the given phone', async () => {
      const thrownError = new ConflictError('Phone already used');
      const phone = faker.phone.phoneNumber();
      const foundUser = { phone } as User;

      mockUserRepository.findOne = jest.fn().mockResolvedValue(foundUser);

      await expect(userService.create({ ...userCreationDto, phone })).rejects.toStrictEqual(thrownError);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ phone });
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockUserRepository.manager.transaction).not.toHaveBeenCalled();
      expect(mockUserRepository.manager.save).not.toHaveBeenCalled();
      expect(mockCacheService.setHash).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    const userId = faker.datatype.number(100);

    it('Should throw the EntityNotFoundError exception if no user is found in cache or database', async () => {
      const thrownError = new EntityNotFoundError('User not found');

      mockCacheService.getHash = jest.fn().mockResolvedValue(null);
      mockUserRepository.findOne = jest.fn();

      await expect(userService.find(userId)).rejects.toStrictEqual(thrownError);
      expect(mockCacheService.getHash).toHaveBeenCalledWith(`user:${userId}:data`);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
    });

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
      mockUserRepository.findOne = jest.fn();

      const foundUser = await userService.find(userId);

      expect(foundUser).toStrictEqual({
        ...user,
        id: Number(user.id),
        dateOfBirth: new Date(Number(user.dateOfBirth)),
        createdAt: new Date(Number(user.createdAt)),
        disabledAt: new Date(Number(user.disabledAt))
      });
      expect(mockCacheService.getHash).toHaveBeenCalledWith(`user:${userId}:data`);
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
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
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);

      const foundUser = await userService.find(userId);

      expect(foundUser).toStrictEqual(user);
      expect(mockCacheService.getHash).toHaveBeenCalledWith(`user:${userId}:data`);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
