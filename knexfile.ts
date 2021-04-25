import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    migrations: {
      tableName: 'migrations',
      directory: 'migrations',
      extension: 'ts'
    }
  }
};
