import { MigrationInterface, QueryRunner } from 'typeorm'

export class Todo1545580534328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `todo` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `parentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    )
    await queryRunner.query(
      'ALTER TABLE `todo` ADD CONSTRAINT `FK_33a2d8417d01bf282bb9d027c3d` FOREIGN KEY (`parentId`) REFERENCES `todo`(`id`)',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `todo` DROP FOREIGN KEY `FK_33a2d8417d01bf282bb9d027c3d`',
    )
    await queryRunner.query('DROP TABLE `todo`')
  }
}
