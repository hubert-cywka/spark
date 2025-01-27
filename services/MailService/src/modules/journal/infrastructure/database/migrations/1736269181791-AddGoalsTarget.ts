import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoalsTarget1736269181791 implements MigrationInterface {
    name = "AddGoalsTarget1736269181791";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" RENAME COLUMN "isAccomplished" TO "target"');
        await queryRunner.query('ALTER TABLE "goal" DROP COLUMN "target"');
        await queryRunner.query('ALTER TABLE "goal" ADD "target" smallint NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP COLUMN "target"');
        await queryRunner.query('ALTER TABLE "goal" ADD "target" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "goal" RENAME COLUMN "target" TO "isAccomplished"');
    }
}
