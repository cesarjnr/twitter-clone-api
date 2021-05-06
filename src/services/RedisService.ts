import { Service, Inject } from 'typedi';
import { RedisClient } from 'redis';
import { promisify } from 'util';

interface PromisifiedRedisClient {
  hmset(args: [string, ...(string | number)[]]): Promise<string>
}

type HashData<T> ={
  [key in keyof T]: string | number;
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

  private isHashValueNullOrUndefined(keyValueArray: [string, string | number]): boolean {
    const value = keyValueArray[1];

    if (value === null || value === undefined) {
      return false;
    } else {
      return true;
    }
  }

  private convertHashDataToArrayOfStrings<T>(data: HashData<T>): (string | number)[] {
    return Object
    .entries<string | number>(data)
    .filter(this.isHashValueNullOrUndefined)
    .flat();
  }

  public async setHash<T>(key: string, data: HashData<T>): Promise<void> {
    const hashDataAsArrayOfStrings = this.convertHashDataToArrayOfStrings<T>(data);

    await this.redisClient.hmset([key, ...hashDataAsArrayOfStrings]);
  }
}
