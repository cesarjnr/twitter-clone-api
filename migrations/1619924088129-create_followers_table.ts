import { MigrationInterface, QueryRunner } from 'typeorm';

export class createFollowersTable1619924088129 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE followers (
        user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
        follower_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
        PRIMARY KEY (user_id, follower_id)
      );

      CREATE INDEX followers_user_id_fkey ON followers (user_id);
      CREATE INDEX followers_follower_id_key ON followers (follower_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE followers');
  }
}
