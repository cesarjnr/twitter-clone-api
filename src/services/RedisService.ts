// import { Inject, Service } from 'typedi';
// import { RedisClient } from 'redis';
// import { promisify } from 'util';

// interface PromisifiedRedisClient {
//   bulkSet(keysAndValues: string[]): Promise<boolean>;
// }

// @Service('cacheService')
// export class RedisService {
//   private redisClient: PromisifiedRedisClient;

//   public constructor(
//     @Inject('redisClient') redisClient: RedisClient
//   ) {
//     this.redisClient = {
//       bulkSet: promisify<string[], boolean>(redisClient.mset).bind(redisClient)
//     };
//   }

//   public async bulkSet(keysAndValues: string[]): Promise<boolean> {
//     const result = await this.redisClient.bulkSet(keysAndValues);

//     return result;
//   }
// }
