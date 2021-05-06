import { Service, Inject } from 'typedi';
import { Repository, EntityManager } from 'typeorm';

import { User } from '../models/User';
import { RedisService } from './RedisService';

interface UserCreationDTO {
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
  private redisService: RedisService;

  public constructor(
    @Inject('userRepository') userRepository: Repository<User>,
    @Inject('redisService') redisService: RedisService
  ) {
    this.userRepository = userRepository;
    this.redisService = redisService;
  }

  private async findUsingManager(manager: EntityManager, id: number): Promise<User> {
    const user = await manager.findOneOrFail(User, id);

    return user;
  }

  private async saveInCache(manager: EntityManager, id: number): Promise<void> {
    const user = await this.findUsingManager(manager, id);
    const hashKey = `user:${user.id}:data`;

    await this.redisService.setHash<User>(
      hashKey,
      {
        ...user,
        dateOfBirth: user.dateOfBirth.getTime(),
        createdAt: user.createdAt.getTime(),
        disabledAt: user.disabledAt?.getTime()
      }
    );
  }

  public async create(requestPayload: UserCreationDTO): Promise<Partial<User>> {
    const user = new User(
      requestPayload.name,
      requestPayload.password,
      requestPayload.dateOfBirth,
      requestPayload.username,
      requestPayload.email,
      requestPayload.phone
    );

    await this.userRepository.manager.transaction(async manager => {
      await manager.save<User>(user);
      await this.saveInCache(manager, user.id);
    });

    return user;
  }
}
