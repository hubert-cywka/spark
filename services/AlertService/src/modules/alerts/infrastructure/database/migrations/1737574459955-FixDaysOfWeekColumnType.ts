import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDaysOfWeekColumnType1737574459955 implements MigrationInterface {
    name = "FixDaysOfWeekColumnType1737574459955";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "daysOfWeek"');
        await queryRunner.query('ALTER TABLE "alert" ADD "daysOfWeek" text array NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "daysOfWeek"');
        await queryRunner.query('ALTER TABLE "alert" ADD "daysOfWeek" text NOT NULL');
    }
}
