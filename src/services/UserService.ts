import { Service, Inject } from 'typedi';
import { FindConditions, Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from '../models/User';
import { CacheService, HashValues } from '../interfaces/CacheService';
import { ConflictError, EntityNotFoundError } from '../utils/error';
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

  public async create(userCreationDto: UserCreationDTO): Promise<User> {
    await this.checkIfUserAlreadyExists(userCreationDto);

    const passwordHash = await this.generateHash(userCreationDto.password);
    let user = new User(
      userCreationDto.name,
      passwordHash,
      userCreationDto.dateOfBirth,
      userCreationDto.username,
      userCreationDto.email,
      userCreationDto.phone
    );

    await this.userRepository.manager.transaction(async manager => {
      user = await manager.save<User>(user);

      await this.saveInCache(user);
    });

    return user;
  }

  public async find(id: number): Promise<User> {
    let user: HashValues<User> | User | null | undefined = await this.cacheService.getHash<User>(`user:${id}:data`);

    if (!user) {
      user = await this.userRepository.findOne(id);

      if (!user) {
        throw new EntityNotFoundError('User not found');
      }
    }

    return Object.assign(user, {
      id: Number(user.id),
      dateOfBirth: typeof user.dateOfBirth === 'string' ? new Date(Number(user.dateOfBirth)) : user.dateOfBirth,
      createdAt: typeof user.createdAt === 'string' ? new Date(Number(user.createdAt)) : user.createdAt,
      disabledAt: typeof user.disabledAt === 'string' ? new Date(Number(user.disabledAt)) : user.disabledAt
    });
  }

  private async checkIfUserAlreadyExists(userCreationDto: UserCreationDTO): Promise<void> {
    const findConditions: FindConditions<User> = {};
    let fieldUsed: string;

    if (userCreationDto.email) {
      Object.assign(findConditions, { email: userCreationDto.email });
      fieldUsed = 'Email';
    } else {
      Object.assign(findConditions, { phone: userCreationDto.phone });
      fieldUsed = 'Phone';
    }

    const user = await this.userRepository.findOne(findConditions);

    if (user) {
      throw new ConflictError(`${fieldUsed} already used`);
    }
  }

  private async generateHash(password: string): Promise<string> {
    const rounds = 10;

    return await hash(password, rounds);
  }

  private async saveInCache(user: User): Promise<void> {
    const hashKey = `user:${user.id}:data`;
    const preparedObj = this.prepareObjectForCaching(user);

    await this.cacheService.setHash<ObjectWithoutNullishValues<User>>(hashKey, preparedObj);
  }

  private prepareObjectForCaching(user: User): ObjectWithoutNullishValues<User> {
    const userWithoutNullishValues = removeNullishValues<User>(user);

    return {
      ...userWithoutNullishValues,
      dateOfBirth: user.dateOfBirth.getTime(),
      createdAt: user.createdAt.getTime()
    };
  }
}
