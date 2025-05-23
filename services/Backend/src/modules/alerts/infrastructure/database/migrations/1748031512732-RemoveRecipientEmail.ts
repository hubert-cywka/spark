import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRecipientEmail1748031512732 implements MigrationInterface {
    name = "RemoveRecipientEmail1748031512732";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "recipient" DROP COLUMN "email"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "recipient" ADD "email" character varying NOT NULL');
    }
}
