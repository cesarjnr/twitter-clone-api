import _ from 'lodash';
import { Service, Inject } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';

interface PromisifiedRedisClient {
  hmset(args: [string, ...(string | number)[]]): Promise<string>
}

type SetHashData = {
  [key: string]: string | number;
}

@Service('redisService')
export class RedisService {
  private redisClient: PromisifiedRedisClient;

  public constructor(
    @Inject('redisClient') redisClient: RedisClient
  ) {
    this.redisClient = {
      hmset: promisify<[string, ...(string | number)[]], string>(redisClient.hmset).bind(redisClient)
    };
  }

  private prepareHashData(data: SetHashData): string[] {

  }

  public async setHash(key: string, data: SetHashData): Promise<void> {
    const keyValuesStringArray = _.flatten(Object.entries(data));

    await this.redisClient.hmset([key, ...keyValuesStringArray]);
  }
}
