// import { Service, Inject } from 'typedi';

// import { RedisService } from './redis.service';

// @Service('tweetService')
// export class TweetService {
//   private redisService: RedisService;

//   public constructor(
//     @Inject('redisService') redisService: RedisService
//   ) {
//     this.redisService = redisService;
//   }

//   public async create(data: any): Promise<boolean> {
//     const { user_id, ...rest } = data;

//     await this.redisService.bulkSet([
//       `user:${String(user_id)}:timeline`, 'test 1',
//       `user:2:timeline`, 'test 2'
//     ]);

//     return true;
//   }
// }
