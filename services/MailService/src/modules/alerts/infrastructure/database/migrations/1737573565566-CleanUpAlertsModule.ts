import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanUpAlertsModule1737573565566 implements MigrationInterface {
    name = "CleanUpAlertsModule1737573565566";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c47ec76d2c5097d80eaae03853d"');
        await queryRunner.query(
            'CREATE TABLE "recipient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "PK_9f7a695711b2055e3c8d5cfcfa1" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "alertTime"');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "userId"');
        await queryRunner.query('ALTER TABLE "alert" ADD "time" TIME NOT NULL');
        await queryRunner.query('ALTER TABLE "alert" ADD "daysOfWeek" text NOT NULL');
        await queryRunner.query('ALTER TABLE "alert" ADD "recipientId" uuid NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f" FOREIGN KEY ("recipientId") REFERENCES "recipient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f"');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "recipientId"');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "daysOfWeek"');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "time"');
        await queryRunner.query('ALTER TABLE "alert" ADD "userId" uuid');
        await queryRunner.query('ALTER TABLE "alert" ADD "alertTime" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('DROP TABLE "recipient"');
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c47ec76d2c5097d80eaae03853d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
