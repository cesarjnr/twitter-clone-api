import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';

import { User } from '../models/User';
import { RedisService } from './RedisService';

interface CreateUserDTO {
  name: string;
  password: string;
  dateOfBirth: Date;
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

  public async create(requestPayload: CreateUserDTO): Promise<User> {
    const user = new User(
      requestPayload.name,
      requestPayload.password,
      requestPayload.dateOfBirth,
      requestPayload.username,
      requestPayload.email,
      requestPayload.phone
    );
    await this.userRepository.save(user);

    await this.redisService.setHash(`user:${user.id}:data`, user);

    return user;
  }
}
