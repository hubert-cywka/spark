import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionConfiguration1767888111175 implements MigrationInterface {
    name = "TimestampsPrecisionConfiguration1767888111175";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"feature_flag\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"feature_flag\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"feature_flag\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"feature_flag\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"tenant\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
