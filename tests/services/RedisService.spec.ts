import faker from 'faker';
import util from 'util';
import { RedisClient } from 'redis';

import { RedisService } from '../../src/services/RedisService';

describe('RedisService', () => {
  const spyPromisify = jest.spyOn(util, 'promisify');
  const mockRedisClient = {} as jest.Mocked<RedisClient>;
  const mockPromisifiedHmset = jest.fn();
  const mockPromisifiedHgetall = jest.fn();
  let redisService: RedisService;

  beforeAll(() => {
    mockRedisClient.hmset = jest.fn();
    mockRedisClient.hgetall = jest.fn();
    spyPromisify.mockReturnValueOnce(mockPromisifiedHmset);
    spyPromisify.mockReturnValueOnce(mockPromisifiedHgetall);

    redisService = new RedisService(mockRedisClient);
  });

  describe('setHash', () => {
    it('Should set a hash in cache', async () => {
      const hashKey = faker.random.word();
      const hashData = {
        name: faker.name.findName(),
        email: faker.internet.email()
      };

      await redisService.setHash(hashKey, hashData);

      expect(mockPromisifiedHmset).toHaveBeenCalledWith([
        hashKey,
        'name',
        hashData.name,
        'email',
        hashData.email
      ]);
    });
  });

  describe('getHash', () => {
    it('Should get a hash from cache', async () => {
      const hashKey = 'key';
      const hashValues = {
        name: faker.name.findName(),
        email: faker.internet.email()
      };

      mockPromisifiedHgetall.mockResolvedValue(hashValues);

      const returnedHash = await redisService.getHash(hashKey);

      expect(returnedHash).toStrictEqual(hashValues);
      expect(mockPromisifiedHgetall).toHaveBeenCalledWith(hashKey);
    });
  });
});
