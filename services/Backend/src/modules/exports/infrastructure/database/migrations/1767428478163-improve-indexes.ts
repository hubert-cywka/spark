import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveIndexes1767428478163 implements MigrationInterface {
    name = "ImproveIndexes1767428478163";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_manifest_lookup"');
        await queryRunner.query(
            'ALTER TYPE "public"."export_attachment_manifest_stage_enum" RENAME TO "export_attachment_manifest_stage_enum_old"'
        );
        await queryRunner.query("CREATE TYPE \"public\".\"export_attachment_manifest_stage_enum\" AS ENUM('temporary', 'final')");
        await queryRunner.query(
            'ALTER TABLE "export_attachment_manifest" ALTER COLUMN "stage" TYPE "public"."export_attachment_manifest_stage_enum" USING "stage"::"text"::"public"."export_attachment_manifest_stage_enum"'
        );
        await queryRunner.query('DROP TYPE "public"."export_attachment_manifest_stage_enum_old"');
        await queryRunner.query('CREATE INDEX "idx_manifest_export" ON "export_attachment_manifest" ("dataExportId") ');
        await queryRunner.query(
            'CREATE INDEX "idx_manifest_lookup" ON "export_attachment_manifest" ("tenantId", "dataExportId", "stage") '
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_manifest_lookup"');
        await queryRunner.query('DROP INDEX "public"."idx_manifest_export"');
        await queryRunner.query(
            "CREATE TYPE \"public\".\"export_attachment_manifest_stage_enum_old\" AS ENUM('Partial', 'Final', 'temporary', 'final')"
        );
        await queryRunner.query(
            'ALTER TABLE "export_attachment_manifest" ALTER COLUMN "stage" TYPE "public"."export_attachment_manifest_stage_enum_old" USING "stage"::"text"::"public"."export_attachment_manifest_stage_enum_old"'
        );
        await queryRunner.query('DROP TYPE "public"."export_attachment_manifest_stage_enum"');
        await queryRunner.query(
            'ALTER TYPE "public"."export_attachment_manifest_stage_enum_old" RENAME TO "export_attachment_manifest_stage_enum"'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_manifest_lookup" ON "export_attachment_manifest" ("dataExportId", "stage", "tenantId") '
        );
    }
}
