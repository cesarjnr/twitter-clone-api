import Container from 'typedi';
import { getRepository } from 'typeorm';

import logger from '../utils/logger';
import { removeNullishValues } from '../utils/object';
import { CacheService } from '../interfaces/CacheService';
import { User } from '../models/User';

export const importDatabaseDataToRedis = async (): Promise<void> => {
  logger.info({
    label: 'ImportDatabaseDataToRedis',
    message: 'Getting users...'
  });

  const userRepository = getRepository(User);
  const users = await userRepository.find();
  const formattedUsers = users.map(user => ({
    ...user,
    dateOfBirth: user.dateOfBirth.getTime(),
    profilePictureUrl: user.profilePictureUrl,
    backgroundPictureUrl: user.backgroundPictureUrl,
    createdAt: user.createdAt.getTime(),
    disabledAt: user.disabledAt?.getTime()
  }));
  const usersWithoutNullishValues = formattedUsers.map((user: any) => removeNullishValues(user));
  const cacheService = Container.get<CacheService>('cacheService');

  logger.info({
    label: 'ImportDatabaseDataToRedis',
    message: 'Persisting users in cache...'
  });

  for (const user of usersWithoutNullishValues) {
    const hashKey = `user:${user.id}:data`;

    await cacheService.setHash(hashKey, user);
  }
}
