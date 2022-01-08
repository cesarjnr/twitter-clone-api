import { Service, Inject } from 'typedi';
import { Repository, EntityManager } from 'typeorm';

import { User } from '../models/User';
import { CacheService } from '../interfaces/CacheService';
import { ObjectWithoutNullishValues, removeNullishValues } from '../utils/object';

export interface UserCreationDTO {
  name: string;
  password: string;
  dateOfBirth: string;
  username: string;
  email?: string;
  phone?: string;
}

@Service('userService')
export class UserService {
  private userRepository: Repository<User>;
  private cacheService: CacheService;

  public constructor(
    @Inject('userRepository') userRepository: Repository<User>,
    @Inject('cacheService') cacheService: CacheService
  ) {
    this.userRepository = userRepository;
    this.cacheService = cacheService;
  }

  public async create(requestPayload: UserCreationDTO): Promise<User> {
    let user = new User(
      requestPayload.name,
      requestPayload.password,
      requestPayload.dateOfBirth,
      requestPayload.username,
      requestPayload.email,
      requestPayload.phone
    );

    await this.userRepository.manager.transaction(async manager => {
      user = await this.persistInDatabase(manager, user);

      await this.saveInCache(user);
    });

    return user;
  }

  public async find(id: number): Promise<User> {
    const user = await this.cacheService.getHash<User>(`user:${id}:data`);

    return {
      ...user,
      id: Number(user.id),
      dateOfBirth: new Date(Number(user.dateOfBirth)),
      createdAt: new Date(Number(user.createdAt)),
      disabledAt: new Date(Number(user.disabledAt))
    };
  }

  private async persistInDatabase(manager: EntityManager, user: User): Promise<User> {
    const insertResult = await manager
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .values(user)
      .returning("*")
      .execute();

    return insertResult.generatedMaps[0] as User;
  }

  private async saveInCache(user: User): Promise<void> {
    const hashKey = `user:${user.id}:data`;
    const preparedObj = this.prepareObjectForCaching(user);

    await this.cacheService.setHash<ObjectWithoutNullishValues<User>>(hashKey, preparedObj);
  }

  private prepareObjectForCaching(user: User): ObjectWithoutNullishValues<User> {
    const userWithoutNullishValues = removeNullishValues<User>(user);

    if (user.disabledAt) {
      userWithoutNullishValues.disabledAt = user.disabledAt.getTime();
    }

    return {
      ...userWithoutNullishValues,
      dateOfBirth: user.dateOfBirth.getTime(),
      createdAt: user.createdAt.getTime()
    };
  }
}
