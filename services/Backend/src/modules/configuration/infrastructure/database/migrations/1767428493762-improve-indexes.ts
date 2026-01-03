import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveIndexes1767428493762 implements MigrationInterface {
    name = "ImproveIndexes1767428493762";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_KEY_TENANT_ID"');
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_TENANT_ID"');
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_KEY"');
        await queryRunner.query('ALTER TABLE "feature_flag" DROP CONSTRAINT "UQ_49b0237d95e9f0164218ecafd52"');
        await queryRunner.query('CREATE UNIQUE INDEX "idx_feature_flag_key_tenant_id" ON "feature_flag" ("key", "tenantId") ');
        await queryRunner.query('CREATE INDEX "idx_feature_flag_tenant_id" ON "feature_flag" ("tenantId") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_feature_flag_tenant_id"');
        await queryRunner.query('DROP INDEX "public"."idx_feature_flag_key_tenant_id"');
        await queryRunner.query('ALTER TABLE "feature_flag" ADD CONSTRAINT "UQ_49b0237d95e9f0164218ecafd52" UNIQUE ("key", "tenantId")');
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_KEY" ON "feature_flag" ("key") ');
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_TENANT_ID" ON "feature_flag" ("tenantId") ');
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_KEY_TENANT_ID" ON "feature_flag" ("key", "tenantId") ');
    }
}
