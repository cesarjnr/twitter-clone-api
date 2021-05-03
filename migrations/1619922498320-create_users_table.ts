import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1619922498320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(255) UNIQUE,
        password VARCHAR(16) NOT NULL,
        date_of_birth DATE NOT NULL,
        username VARCHAR(15) UNIQUE NOT NULL,
        bio VARCHAR(255),
        profile_picture_url VARCHAR(255),
        background_picture_url VARCHAR(255),
        location VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        disabled_at TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users;');
  }
}
