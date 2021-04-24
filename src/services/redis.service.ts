import { Inject, Service } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';

import { CacheServiceInterface } from '../types';

interface PromisifiedRedisClient {
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string | null>;
}

@Service('cacheService')
export class RedisService implements CacheServiceInterface {
  private redisClient: PromisifiedRedisClient;

  public constructor(
    @Inject('redisClient') redisClient: RedisClient
  ) {
    this.redisClient = {
      set: promisify(redisClient.set),
      get: promisify(redisClient.get)
    };
  }

  public async set(key: string, value: string): Promise<void> {
    this.redisClient.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);

    return value;
  }
}
