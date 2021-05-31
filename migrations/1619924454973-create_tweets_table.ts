import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTweetsTable1619924454973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'tweets',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'content',
          type: 'varchar'
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'NOW()'
        },
        {
          name: 'user_id',
          type: 'int'
        },
        {
          name: 'tweet_id',
          type: 'int'
        }
      ],
      foreignKeys: [
        {
          name: 'fk_tweets_users_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        },
        {
          name: 'fk_tweets_tweets_tweet_id',
          columnNames: ['tweet_id'],
          referencedTableName: 'tweets',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        }
      ],
      indices: [
        {
          name: 'fk_tweets_user_id',
          columnNames: ['user_id']
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tweets');
  }
}
