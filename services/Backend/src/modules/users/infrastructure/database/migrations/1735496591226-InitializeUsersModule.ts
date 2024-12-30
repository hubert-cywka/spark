import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeUsersModule1735496591226 implements MigrationInterface {
    name = "InitializeUsersModule1735496591226";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "inbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9b85eb4cab41c7c6023b1e579d0" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "inbox_event"');
    }
}
