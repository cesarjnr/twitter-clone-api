import { Service, Inject } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';

import { CacheService, HashInput, HashValues } from '../interfaces/CacheService';

interface PromisifiedRedisClient {
  hmset(args: [string, ...(string | number)[]]): Promise<string>
  hgetall(key: string): Promise<{ [key: string]: string }>
}

@Service('cacheService')
export class RedisService implements CacheService {
  private redisClient: PromisifiedRedisClient;

  public constructor(
    @Inject('redisClient') redisClient: RedisClient
  ) {
    this.redisClient = {
      hmset: promisify<[string, ...(string | number)[]], string>(redisClient.hmset)
        .bind(redisClient),
      hgetall: promisify<string, { [key: string]: string }>(redisClient.hgetall)
        .bind(redisClient)
    };
  }

  public async setHash<T>(key: string, data: HashInput<T>): Promise<void> {
    const hashDataAsArrayOfStrings = this.convertHashDataToArrayOfStrings<T>(data);

    await this.redisClient.hmset([key, ...hashDataAsArrayOfStrings]);
  }

  public async getHash<T extends object>(key: string): Promise<HashValues<T>> {
    const hash = await this.redisClient.hgetall(key) as HashValues<T>;

    return hash;
  }

  private convertHashDataToArrayOfStrings<T>(data: HashInput<T>): (string | number)[] {
    return Object
      .entries<string | number>(data)
      .flat();
  }
}
