import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndicesToFfTable1765022076178 implements MigrationInterface {
    name = "AddIndicesToFfTable1765022076178";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_KEY_TENANT_ID" ON "feature_flag" ("key", "tenantId") ');
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_TENANT_ID" ON "feature_flag" ("tenantId") ');
        await queryRunner.query('CREATE INDEX "IDX_FEATURE_FLAG_KEY" ON "feature_flag" ("key") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_KEY"');
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_TENANT_ID"');
        await queryRunner.query('DROP INDEX "public"."IDX_FEATURE_FLAG_KEY_TENANT_ID"');
    }
}
