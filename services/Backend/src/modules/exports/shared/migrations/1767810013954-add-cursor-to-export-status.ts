import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCursorToExportStatus1767810013954 implements MigrationInterface {
    name = "AddCursorToExportStatus1767810013954";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_status" ADD "nextCursor" character varying');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_status" DROP COLUMN "nextCursor"');
    }
}
