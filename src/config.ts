import dotenv from 'dotenv';

dotenv.config();

const config = {
  common: {
    env: process.env.ENV,
    port: process.env.PORT
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
};

export default config;
