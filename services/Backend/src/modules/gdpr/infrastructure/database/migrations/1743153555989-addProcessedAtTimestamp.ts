import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProcessedAtTimestamp1743153555989 implements MigrationInterface {
    name = "AddProcessedAtTimestamp1743153555989";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" ADD "processedAt" TIMESTAMP WITH TIME ZONE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP COLUMN "processedAt"');
    }
}
