import { Service, Inject } from "typedi";

import { CacheServiceInterface } from '../types';

@Service()
export class TweetService {
  private cacheService: CacheServiceInterface;

  public constructor(
    @Inject('cacheService') cacheService: CacheServiceInterface
  ) {
    this.cacheService = cacheService;
  }
}
