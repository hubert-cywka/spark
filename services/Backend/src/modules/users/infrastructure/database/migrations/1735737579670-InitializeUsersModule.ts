import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeUsersModule1735737579670 implements MigrationInterface {
    name = "InitializeUsersModule1735737579670";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "inbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9b85eb4cab41c7c6023b1e579d0" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "outbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cc0c9e40998e45ecfc5e313429d" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "user" ("id" character varying NOT NULL, "email" character varying NOT NULL, "lastName" character varying NOT NULL, "firstName" character varying NOT NULL, "isActivated" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('DROP TABLE "outbox_event"');
        await queryRunner.query('DROP TABLE "inbox_event"');
    }
}
