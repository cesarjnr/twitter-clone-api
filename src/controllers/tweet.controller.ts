// import { Inject, Service } from 'typedi';
// import { Request, Response } from 'express';

// import { TweetService } from '../services/tweet.service';

// @Service('tweetController')
// export class TweetController {
//   private tweetService: TweetService;

//   public constructor(
//     @Inject('tweetService') tweetService: TweetService
//   ) {
//     this.tweetService = tweetService;
//   }

//   public async create(request: Request, response: Response): Promise<void> {
//     const tweet = await this.tweetService.create(request.body);

//     response.json({ redisResponse: tweet });
//   }
// }
