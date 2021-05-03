import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTweetsTable1619924454973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tweets (
        id SERIAL PRIMARY KEY,
        content VARCHAR(280) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
        tweet_id INT REFERENCES tweets ON DELETE CASCADE
      );

      CREATE INDEX tweets_user_id_fkey ON tweets (user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE tweets;');
  }
}
