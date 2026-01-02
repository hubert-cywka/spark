import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381710806 implements MigrationInterface {
    name = "AddIndexes1767381710806";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE INDEX "idx_manifest_lookup" ON "export_attachment_manifest" ("tenantId", "dataExportId", "stage") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_data_export_active" ON "data_export" ("tenantId") WHERE "cancelledAt" IS NULL AND "completedAt" IS NULL'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_data_export_active"');
        await queryRunner.query('DROP INDEX "public"."idx_manifest_lookup"');
    }
}
