import { MigrationInterface, QueryRunner } from "typeorm";

export class Cleanup1748765396554 implements MigrationInterface {
    name = "Cleanup1748765396554";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event_partition" DROP CONSTRAINT "FK_09d98ae5bd8beaff320d900bfbe"');
        await queryRunner.query('ALTER TABLE "outbox_event_partition" DROP CONSTRAINT "FK_aaa8535e9696603e270a85f5165"');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" DROP COLUMN "idId"');
        await queryRunner.query('ALTER TABLE "outbox_event_partition" DROP COLUMN "idId"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event_partition" ADD "idId" uuid');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" ADD "idId" uuid');
        await queryRunner.query(
            'ALTER TABLE "outbox_event_partition" ADD CONSTRAINT "FK_aaa8535e9696603e270a85f5165" FOREIGN KEY ("idId") REFERENCES "outbox_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "inbox_event_partition" ADD CONSTRAINT "FK_09d98ae5bd8beaff320d900bfbe" FOREIGN KEY ("idId") REFERENCES "inbox_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
