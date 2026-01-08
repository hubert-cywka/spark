import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionPrivacy1767888120139 implements MigrationInterface {
    name = "TimestampsPrecisionPrivacy1767888120139";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"scheduledAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"removeAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"removeAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"data_purge_plan\" ALTER COLUMN \"scheduledAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
