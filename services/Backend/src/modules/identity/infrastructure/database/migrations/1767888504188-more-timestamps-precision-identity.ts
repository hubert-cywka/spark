import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreTimestampsPrecisionIdentity1767888504188 implements MigrationInterface {
    name = "MoreTimestampsPrecisionIdentity1767888504188";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"single_use_token\" ALTER COLUMN \"invalidatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"single_use_token\" ALTER COLUMN \"usedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"refresh_token\" ALTER COLUMN \"invalidatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"activatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"termsAndConditionsAcceptedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"suspendedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query(
            "ALTER TABLE \"two_factor_authentication_integration\" ALTER COLUMN \"enabledAt\" TYPE TIMESTAMP(3) WITH TIME ZONE"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"two_factor_authentication_integration\" ALTER COLUMN \"enabledAt\" TYPE TIMESTAMP(6) WITH TIME ZONE"
        );
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"suspendedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"termsAndConditionsAcceptedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"account\" ALTER COLUMN \"activatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"refresh_token\" ALTER COLUMN \"invalidatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"single_use_token\" ALTER COLUMN \"usedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"single_use_token\" ALTER COLUMN \"invalidatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
