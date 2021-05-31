import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsersTable1619922498320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'phone',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'password',
          type: 'varchar',
          length: '16'
        },
        {
          name: 'date_of_birth',
          type: 'date'
        },
        {
          name: 'username',
          type: 'varchar',
          length: '15'
        },
        {
          name: 'bio',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'profile_picture_url',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'background_picture_url',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'location',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'NOW()'
        },
        {
          name: 'disabled_at',
          type: 'timestamp',
          isNullable: true
        }
      ],
      uniques: [
        {
          name: 'UQ_users_email',
          columnNames: ['email']
        },
        {
          name: 'UQ_users_phone',
          columnNames: ['phone']
        },
        {
          name: 'UQ_users_username',
          columnNames: ['username']
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
