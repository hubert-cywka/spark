import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestamps1752925853545 implements MigrationInterface {
    name = "AddTimestamps1752925853545";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "recipient" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "recipient" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "recipient" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "recipient" DROP COLUMN "createdAt"');
    }
}
