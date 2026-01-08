import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExportStatus1767800772167 implements MigrationInterface {
    name = "AddExportStatus1767800772167";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "export_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "exportId" character varying NOT NULL, "domain" character varying NOT NULL, "exportedUntil" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1034cd2848b77b882fae076c8a3" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE UNIQUE INDEX "idx_export_status" ON "export_status" ("exportId", "domain") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_export_status"');
        await queryRunner.query('DROP TABLE "export_status"');
    }
}
