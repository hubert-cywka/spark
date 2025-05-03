import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserPersonalInfo1746284981052 implements MigrationInterface {
    name = "RemoveUserPersonalInfo1746284981052";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "lastName"');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "firstName"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "firstName" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "user" ADD "lastName" character varying NOT NULL');
    }
}
