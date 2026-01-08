import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionUsers1767888115678 implements MigrationInterface {
    name = "TimestampsPrecisionUsers1767888115678";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
