import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstAndLastNameFieldsToUser1728058199103 implements MigrationInterface {
    name = "AddFirstAndLastNameFieldsToUser1728058199103";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "lastName" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "user" ADD "firstName" character varying NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "firstName"');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "lastName"');
    }
}
