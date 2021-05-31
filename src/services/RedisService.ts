import { Service, Inject } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';

import { CacheService, HashData } from '../interfaces/CacheService';

interface PromisifiedRedisClient {
  hmset(args: [string, ...(string | number)[]]): Promise<string>
}

@Service('redisService')
export class RedisService implements CacheService {
  private redisClient: PromisifiedRedisClient;

  public constructor(
    @Inject('redisClient') redisClient: RedisClient
  ) {
    this.redisClient = {
      hmset: promisify<[string, ...(string | number)[]], string>(redisClient.hmset).bind(redisClient)
    };
  }

  public async setHashMap<T>(key: string, data: HashData<T>): Promise<void> {
    const hashDataAsArrayOfStrings = this.convertHashDataToArrayOfStrings<T>(data);

    await this.redisClient.hmset([key, ...hashDataAsArrayOfStrings]);
  }

  private convertHashDataToArrayOfStrings<T>(data: HashData<T>): (string | number)[] {
    return Object
      .entries<string | number>(data)
      .flat();
  }
}
