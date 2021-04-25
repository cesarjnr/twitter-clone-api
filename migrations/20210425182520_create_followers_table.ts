import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable('followers', (table: Knex.CreateTableBuilder) => {
      table.integer('user_id').index('followers_user_id_fkey');
      table.integer('follower_id').index('followers_follower_id_fkey');

      table.primary(['user_id', 'follower_id']);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .foreign('follower_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('followers');
}
