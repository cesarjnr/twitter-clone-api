import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable('users_tweets_likes', (table: Knex.CreateTableBuilder) => {
      table.integer('user_id').index('users_tweets_likes_user_id_fkey');
      table.integer('tweet_id').index('users_tweets_likes_tweet_id_fkey');

      table.primary(['user_id', 'tweet_id']);
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
  return knex.schema.dropTable('users_tweets_likes');
}
