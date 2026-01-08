import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionExports1767888180480 implements MigrationInterface {
    name = "TimestampsPrecisionExports1767888180480";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "tenant" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "tenant" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_data_export"');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "validUntil" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "startedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_data_export" ON "data_export" ("tenantId", "validUntil") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_data_export"');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "startedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "validUntil" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_data_export" ON "data_export" ("tenantId", "validUntil") ');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "tenant" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "tenant" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
    }
}
