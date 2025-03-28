import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOptionToSuspendAccounts1743167408668 implements MigrationInterface {
    name = "AddOptionToSuspendAccounts1743167408668";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "account" ADD "suspendedAt" TIMESTAMP WITH TIME ZONE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "suspendedAt"');
    }
}
