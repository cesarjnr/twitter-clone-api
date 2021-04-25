import knex, { Knex } from 'knex';

import config from '../config';

const databaseLoader = (): Knex => {
  return knex({
    debug: config.common.env === 'dev' ? true : false,
    client: config.database.client,
    connection: {
      host: config.database.host,
      user: config.database.user,
      port: config.database.port,
      password: config.database.password,
      database: config.database.name
    }
  });
}

export default databaseLoader;
