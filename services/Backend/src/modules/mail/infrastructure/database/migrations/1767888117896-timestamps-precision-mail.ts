import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionMail1767888117896 implements MigrationInterface {
    name = "TimestampsPrecisionMail1767888117896";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"recipient\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"recipient\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"recipient\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"recipient\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
