import { MigrationInterface, QueryRunner } from "typeorm";

export class DataExportScaffolding1766833967020 implements MigrationInterface {
    name = "DataExportScaffolding1766833967020";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "data_export" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetScopes" jsonb NOT NULL, "cancelledAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_0765a950021643539f983b764ad" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "export_attachment_manifest" ("key" character varying NOT NULL, "path" character varying NOT NULL, "part" integer NOT NULL, "nextPart" integer, "checksum" character varying NOT NULL, "scopes" jsonb NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dataExportId" uuid NOT NULL, "tenantId" uuid, CONSTRAINT "PK_7269ec9bfba5d5ad28ebf0a0a77" PRIMARY KEY ("key"))'
        );
        await queryRunner.query(
            'ALTER TABLE "data_export" ADD CONSTRAINT "FK_5502cc4482421a2ac526f23329f" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "export_attachment_manifest" ADD CONSTRAINT "FK_9e09f5182b4f31d18b027bff735" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "export_attachment_manifest" ADD CONSTRAINT "FK_8f91727af3420c787424a8c8c12" FOREIGN KEY ("dataExportId") REFERENCES "data_export"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" DROP CONSTRAINT "FK_8f91727af3420c787424a8c8c12"');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" DROP CONSTRAINT "FK_9e09f5182b4f31d18b027bff735"');
        await queryRunner.query('DROP TABLE "export_attachment_manifest"');

        await queryRunner.query('ALTER TABLE "data_export" DROP CONSTRAINT "FK_5502cc4482421a2ac526f23329f"');
        await queryRunner.query('DROP TABLE "data_export"');
    }
}
