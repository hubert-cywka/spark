import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivationTokens1727179586288 implements MigrationInterface {
    name = "AddActivationTokens1727179586288";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "activationToken" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "user" ADD "activatedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "activatedAt"');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "activationToken"');
    }
}
