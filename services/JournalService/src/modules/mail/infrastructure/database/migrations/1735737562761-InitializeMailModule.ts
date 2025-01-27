import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeMailModule1735737562761 implements MigrationInterface {
    name = "InitializeMailModule1735737562761";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "inbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9b85eb4cab41c7c6023b1e579d0" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "outbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cc0c9e40998e45ecfc5e313429d" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "outbox_event"');
        await queryRunner.query('DROP TABLE "inbox_event"');
    }
}
