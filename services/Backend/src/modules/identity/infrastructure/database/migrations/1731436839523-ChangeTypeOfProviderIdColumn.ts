import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeOfProviderIdColumn1731436839523 implements MigrationInterface {
    name = 'ChangeTypeOfProviderIdColumn1731436839523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c650599c2c931e7d7a9758a63c"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "providerId"`);
        await queryRunner.query(`DROP TYPE "public"."account_providerid_enum"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "providerId" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_c650599c2c931e7d7a9758a63c" ON "account" ("providerId", "providerAccountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c650599c2c931e7d7a9758a63c" ON "account" ("providerId", "providerAccountId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c650599c2c931e7d7a9758a63c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c650599c2c931e7d7a9758a63c"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "providerId"`);
        await queryRunner.query(`CREATE TYPE "public"."account_providerid_enum" AS ENUM('google')`);
        await queryRunner.query(`ALTER TABLE "account" ADD "providerId" "public"."account_providerid_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_c650599c2c931e7d7a9758a63c" ON "account" ("providerAccountId", "providerId") `);
    }

}
