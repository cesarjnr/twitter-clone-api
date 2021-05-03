import { MigrationInterface, QueryRunner } from "typeorm";

export class createUsersTweetsLikesTable1619924927067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users_tweets_likes (
        user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
        tweet_id INT NOT NULL REFERENCES tweets ON DELETE CASCADE,
        PRIMARY KEY (user_id, tweet_id)
      );

      CREATE INDEX users_tweets_likes_user_id_fkey ON users_tweets_likes (user_id);
      CREATE INDEX users_tweets_likes_tweet_id_fkey ON users_tweets_likes (tweet_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users_tweets_likes;');
  }
}
