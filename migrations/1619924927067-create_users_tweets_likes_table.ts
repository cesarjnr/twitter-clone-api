import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsersTweetsLikesTable1619924927067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users_tweets_likes',
      columns: [
        {
          name: 'user_id',
          type: 'int',
          isPrimary: true
        },
        {
          name: 'tweet_id',
          type: 'int',
          isPrimary: true
        }
      ],
      foreignKeys: [
        {
          name: 'FK_users_tweets_likes_users_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        },
        {
          name: 'FK_users_tweets_likes_tweets_tweet_id',
          columnNames: ['tweet_id'],
          referencedTableName: 'tweets',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        }
      ],
      indices: [
        {
          name: 'FK_users_tweets_likes_user_id',
          columnNames: ['user_id']
        },
        {
          name: 'FK_users_tweets_likes_tweet_id',
          columnNames: ['tweet_id']
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_tweets_likes')
  }
}
