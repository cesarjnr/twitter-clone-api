import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createFollowersTable1619924088129 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'followers',
      columns: [
        {
          name: 'user_id',
          type: 'int',
          isPrimary: true
        },
        {
          name: 'follower_id',
          type: 'int',
          isPrimary: true
        }
      ],
      foreignKeys: [
        {
          name: 'FK_followers_users_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        },
        {
          name: 'FK_followers_users_follower_id',
          columnNames: ['follower_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        }
      ],
      indices: [
        {
          name: 'FK_followers_user_id',
          columnNames: ['user_id']
        },
        {
          name: 'FK_followers_follower_id',
          columnNames: ['follower_id']
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('followers');
  }
}
