import { MigrationInterface, QueryRunner } from "typeorm";

export class InboxAndOutboxSequenceNumber1753291628862 implements MigrationInterface {
    name = "InboxAndOutboxSequenceNumber1753291628862";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "sequence" BIGSERIAL NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "sequence" BIGSERIAL NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "sequence"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "sequence"');
    }
}
