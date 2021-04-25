import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable('tweets', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.string('content', 280).notNullable();
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .integer('user_id')
        .index('tweets_user_id_fkey')
        .notNullable();
      table.integer('tweet_id');

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .foreign('tweet_id')
        .references('id')
        .inTable('tweets')
        .onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tweets');
}
