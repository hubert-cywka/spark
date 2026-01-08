import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionIdentity1767888089035 implements MigrationInterface {
    name = "TimestampsPrecisionIdentity1767888089035";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_account_status"');
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "expiresAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "expiresAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE'
        );
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE'
        );
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE'
        );
        await queryRunner.query('ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "expiresAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "expiresAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_account_status" ON "account" ("id") WHERE ("suspendedAt" IS NULL)');
    }
}
