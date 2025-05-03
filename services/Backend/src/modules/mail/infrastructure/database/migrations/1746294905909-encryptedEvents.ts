import { MigrationInterface, QueryRunner } from "typeorm";

export class EncryptedEvents1746294905909 implements MigrationInterface {
    name = "EncryptedEvents1746294905909";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "isEncrypted" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "isEncrypted" boolean NOT NULL DEFAULT false');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "isEncrypted"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "isEncrypted"');
    }
}
