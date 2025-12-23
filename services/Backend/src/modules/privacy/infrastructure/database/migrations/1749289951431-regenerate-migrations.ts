import { MigrationInterface, QueryRunner } from "typeorm";

export class RegenerateMigrations1749289951431 implements MigrationInterface {
    name = "RegenerateMigrations1749289951431";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "data_purge_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "removeAt" TIMESTAMP WITH TIME ZONE NOT NULL, "cancelledAt" TIMESTAMP WITH TIME ZONE, "processedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_20d57e5eecee5506958baababc2" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "data_purge_plan" ADD CONSTRAINT "FK_3621ee453cc424a9a20650c99d4" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP CONSTRAINT "FK_3621ee453cc424a9a20650c99d4"');
        await queryRunner.query('DROP TABLE "data_purge_plan"');
        await queryRunner.query('DROP TABLE "tenant"');
    }
}
