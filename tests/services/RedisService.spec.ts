import faker from 'faker';
import { RedisClient } from 'redis';
import { promisify } from 'util';

import { RedisService } from '../../src/services/RedisService';

jest.mock('util');

describe('RedisService', () => {
  const mockPromisify = promisify as jest.MockedFunction<typeof promisify>;
  const mockRedisClient = {} as jest.Mocked<RedisClient>;
  const mockPromisifiedHmset = jest.fn();
  let redisService: RedisService;

  beforeAll(() => {
    mockRedisClient.hmset = jest.fn();
    mockPromisify.mockReturnValue(mockPromisifiedHmset);

    redisService = new RedisService(mockRedisClient);
  });

  describe('setHash', () => {
    it('Should successfully set a hash map in cache', async () => {
      const hashKey = faker.random.word();
      const hashData = {
        name: faker.name.findName(),
        email: faker.internet.email()
      };

      await redisService.setHashMap(hashKey, hashData);

      expect(mockPromisifiedHmset).toHaveBeenCalledWith([
        hashKey,
        'name',
        hashData.name,
        'email',
        hashData.email
      ]);
    });
  });
});
