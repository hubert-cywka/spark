import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataPurgePlans1743151982101 implements MigrationInterface {
    name = "AddDataPurgePlans1743151982101";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "data_purge_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "cancelledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_20d57e5eecee5506958baababc2" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "data_purge_plan" ADD CONSTRAINT "FK_3621ee453cc424a9a20650c99d4" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP CONSTRAINT "FK_3621ee453cc424a9a20650c99d4"');
        await queryRunner.query('DROP TABLE "data_purge_plan"');
    }
}
