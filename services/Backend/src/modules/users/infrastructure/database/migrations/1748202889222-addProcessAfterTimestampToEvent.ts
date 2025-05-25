import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProcessAfterTimestampToEvent1748202889222 implements MigrationInterface {
    name = "AddProcessAfterTimestampToEvent1748202889222";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "processAfter" TIMESTAMP WITH TIME ZONE NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "processAfter"');
    }
}
