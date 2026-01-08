import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreTimestampsPrecisionPrivacy1767888499695 implements MigrationInterface {
    name = "MoreTimestampsPrecisionPrivacy1767888499695";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"cancelledAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"processedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"processedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"cancelledAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
