import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemoveAtTimestampToPurgePlan1747944544022 implements MigrationInterface {
    name = "AddRemoveAtTimestampToPurgePlan1747944544022";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" ADD "removeAt" TIMESTAMP WITH TIME ZONE NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP COLUMN "removeAt"');
    }
}
