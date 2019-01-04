import { MigrationInterface, QueryRunner } from 'typeorm'

export class TodoComplete1546619761367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `todo` ADD `complete` tinyint NOT NULL DEFAULT 0',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `todo` DROP COLUMN `complete`')
  }
}
