import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestamps1752925879790 implements MigrationInterface {
    name = "AddTimestamps1752925879790";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "tenant" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "tenant" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "tenant" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "tenant" DROP COLUMN "createdAt"');
    }
}
