import { MigrationInterface, QueryRunner } from "typeorm";

export class AddValidUntilTimestamp1767790372799 implements MigrationInterface {
    name = "AddValidUntilTimestamp1767790372799";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_data_export_active"');
        await queryRunner.query('ALTER TABLE "data_export" ADD "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('CREATE INDEX "idx_data_export" ON "data_export" ("tenantId", "validUntil") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_data_export"');
        await queryRunner.query('ALTER TABLE "data_export" DROP COLUMN "validUntil"');
        await queryRunner.query(
            'CREATE INDEX "idx_data_export_active" ON "data_export" ("tenantId") WHERE (("cancelledAt" IS NULL) AND ("completedAt" IS NULL))'
        );
    }
}
