import { MigrationInterface, QueryRunner } from "typeorm";

export class HashRefreshTokens1730541294391 implements MigrationInterface {
    name = "HashRefreshTokens1730541294391";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_7f2bc25df3afe0d69f71bd6170"');
        await queryRunner.query('ALTER TABLE "refresh_token" RENAME COLUMN "value" TO "hashedValue"');
        await queryRunner.query(
            'ALTER TABLE "refresh_token" RENAME CONSTRAINT "UQ_7f2bc25df3afe0d69f71bd61705" TO "UQ_80c8c3a65607935e4e3fcc1cbe4"'
        );
        await queryRunner.query('CREATE INDEX "IDX_80c8c3a65607935e4e3fcc1cbe" ON "refresh_token" ("hashedValue") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_80c8c3a65607935e4e3fcc1cbe"');
        await queryRunner.query(
            'ALTER TABLE "refresh_token" RENAME CONSTRAINT "UQ_80c8c3a65607935e4e3fcc1cbe4" TO "UQ_7f2bc25df3afe0d69f71bd61705"'
        );
        await queryRunner.query('ALTER TABLE "refresh_token" RENAME COLUMN "hashedValue" TO "value"');
        await queryRunner.query('CREATE INDEX "IDX_7f2bc25df3afe0d69f71bd6170" ON "refresh_token" ("value") ');
    }
}
