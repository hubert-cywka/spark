import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplementOutbox1735337349949 implements MigrationInterface {
    name = "ImplementOutbox1735337349949";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "outbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP NOT NULL, "processedAt" TIMESTAMP, CONSTRAINT "PK_cc0c9e40998e45ecfc5e313429d" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "outbox_event"');
    }
}
