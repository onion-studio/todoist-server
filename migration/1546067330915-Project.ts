import { MigrationInterface, QueryRunner } from 'typeorm'

export class Project1546067330915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `project_authority` (`id` int NOT NULL AUTO_INCREMENT, `projectId` int NOT NULL, `userId` int NOT NULL, `permission` enum ('Owner', 'Collaborator') NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    )
    await queryRunner.query(
      'CREATE TABLE `project` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    )
    await queryRunner.query('ALTER TABLE `todo` ADD `projectId` int NOT NULL')
    await queryRunner.query(
      'ALTER TABLE `project_authority` ADD CONSTRAINT `FK_0edc109289b348d2c045c4be568` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`)',
    )
    await queryRunner.query(
      'ALTER TABLE `project_authority` ADD CONSTRAINT `FK_42f84d86f226b0343b69a8d47e3` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)',
    )
    await queryRunner.query(
      'ALTER TABLE `todo` ADD CONSTRAINT `FK_114a4b7327487e206983b9be77f` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`)',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `todo` DROP FOREIGN KEY `FK_114a4b7327487e206983b9be77f`',
    )
    await queryRunner.query(
      'ALTER TABLE `project_authority` DROP FOREIGN KEY `FK_42f84d86f226b0343b69a8d47e3`',
    )
    await queryRunner.query(
      'ALTER TABLE `project_authority` DROP FOREIGN KEY `FK_0edc109289b348d2c045c4be568`',
    )
    await queryRunner.query('ALTER TABLE `todo` DROP COLUMN `projectId`')
    await queryRunner.query('DROP TABLE `project`')
    await queryRunner.query('DROP TABLE `project_authority`')
  }
}
