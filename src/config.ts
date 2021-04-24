import dotenv from 'dotenv';

dotenv.config();

const config = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
};

export { config };
