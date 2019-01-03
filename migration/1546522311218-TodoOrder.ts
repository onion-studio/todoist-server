import { MigrationInterface, QueryRunner } from 'typeorm'

export class TodoOrder1546522311218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // NOTE: Breaking change!
    await queryRunner.query('ALTER TABLE `todo` ADD `order` int NOT NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `todo` DROP COLUMN `order`')
  }
}
