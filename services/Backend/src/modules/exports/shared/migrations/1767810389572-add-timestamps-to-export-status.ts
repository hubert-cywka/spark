import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToExportStatus1767810389572 implements MigrationInterface {
    name = "AddTimestampsToExportStatus1767810389572";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_status" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "export_status" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_status" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "export_status" DROP COLUMN "createdAt"');
    }
}
