import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantIdToOutboxAndInbox1743101746907 implements MigrationInterface {
    name = "AddTenantIdToOutboxAndInbox1743101746907";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "tenantId" uuid NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "tenantId" uuid NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "tenantId"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "tenantId"');
    }
}
