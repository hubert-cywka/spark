import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTimestampsFormat1735340469452 implements MigrationInterface {
    name = "ChangeTimestampsFormat1735340469452";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "processedAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "processedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "processedAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "processedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "createdAt" TIMESTAMP NOT NULL');
    }
}
