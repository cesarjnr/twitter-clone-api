import Container from 'typedi';
import { getRepository } from 'typeorm';
import { format } from 'date-fns';

import { removeNullishValues } from '../utils/object';
import { RedisService } from '../services/RedisService';
import { User } from '../models/User';

export const importDatabaseDataToRedis = async (): Promise<void> => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    const formattedUsers = users.map((user: any) => ({
      ...user,
      dateOfBirth: format(user.date_of_birth, 'yyyy-MM-dd'),
      profilePictureUrl: user.profile_picture_url,
      backgroundPictureUrl: user.background_picture_url,
      createdAt: user.created_at.getTime(),
      disabledAt: user.disabled_at?.getTime()
    }));
    const usersWithoutNullishValues = formattedUsers.map((user: any) => removeNullishValues(user));
    const redisService = Container.get<RedisService>('redisService');

    for (const user of usersWithoutNullishValues) {
      const hashKey = `user:${user.id}:data`;

      await redisService.setHashMap(hashKey, user);
    }
  } catch (error) {
    console.log(error);
  }
}
