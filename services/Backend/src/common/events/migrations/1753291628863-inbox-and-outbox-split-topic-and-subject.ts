import { MigrationInterface, QueryRunner } from "typeorm";

export class InboxAndOutboxSplitTopicAndSubject1753291628863 implements MigrationInterface {
    name = "InboxAndOutboxSplitTopicAndSubject1753291628863";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "subject" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "subject" character varying NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "subject"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "subject"');
    }
}
