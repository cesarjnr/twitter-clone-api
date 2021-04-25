import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable('users', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary();
      table.string('name', 50).notNullable();
      table.string('email', 255).unique();
      table.string('phone', 255).unique();
      table.string('password', 16).notNullable();
      table.date('date_of_birth').notNullable();
      table
        .string('username', 15)
        .unique()
        .notNullable();
      table.string('bio', 255);
      table.string('profile_picture_url', 255);
      table.string('background_picture_url', 255);
      table.string('location', 255);
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.timestamp('disabled_at');
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
