import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381819714 implements MigrationInterface {
    name = "AddIndexes1767381819714";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_14e6f13b663a6acda7ae213d07"');
        await queryRunner.query('DROP INDEX "public"."IDX_80c8c3a65607935e4e3fcc1cbe"');
        await queryRunner.query('DROP INDEX "public"."IDX_c650599c2c931e7d7a9758a63c"');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3"');
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "ownerId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "ownerId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "two_factor_authentication_integration" DROP CONSTRAINT "FK_193a665e6adcc639bc5e3fea884"');
        await queryRunner.query('ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "ownerId" SET NOT NULL');
        await queryRunner.query('CREATE INDEX "idx_token_expiry" ON "single_use_token" ("expiresAt") ');
        await queryRunner.query(
            'CREATE INDEX "idx_token_invalidation" ON "single_use_token" ("ownerId", "type") WHERE "invalidatedAt" IS NULL'
        );
        await queryRunner.query('CREATE UNIQUE INDEX "idx_token_value_type_unique" ON "single_use_token" ("value", "type") ');
        await queryRunner.query('CREATE INDEX "idx_refresh_token_expiry" ON "refresh_token" ("expiresAt") ');
        await queryRunner.query(
            'CREATE INDEX "idx_refresh_token_owner_active" ON "refresh_token" ("ownerId") WHERE "invalidatedAt" IS NULL'
        );
        await queryRunner.query('CREATE INDEX "idx_refresh_token_hash" ON "refresh_token" ("hashedValue") ');
        await queryRunner.query('CREATE UNIQUE INDEX "idx_account_provider_identity" ON "account" ("providerId", "providerAccountId") ');
        await queryRunner.query('CREATE INDEX "idx_account_email" ON "account" ("email") ');
        await queryRunner.query(
            'CREATE INDEX "idx_2fa_active_methods" ON "two_factor_authentication_integration" ("ownerId") WHERE "enabledAt" IS NOT NULL'
        );
        await queryRunner.query('CREATE INDEX "idx_2fa_user_method" ON "two_factor_authentication_integration" ("ownerId", "method") ');
        await queryRunner.query(
            'ALTER TABLE "single_use_token" ADD CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ADD CONSTRAINT "FK_193a665e6adcc639bc5e3fea884" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "two_factor_authentication_integration" DROP CONSTRAINT "FK_193a665e6adcc639bc5e3fea884"');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3"');
        await queryRunner.query('DROP INDEX "public"."idx_2fa_user_method"');
        await queryRunner.query('DROP INDEX "public"."idx_2fa_active_methods"');
        await queryRunner.query('DROP INDEX "public"."idx_account_email"');
        await queryRunner.query('DROP INDEX "public"."idx_account_provider_identity"');
        await queryRunner.query('DROP INDEX "public"."idx_refresh_token_hash"');
        await queryRunner.query('DROP INDEX "public"."idx_refresh_token_owner_active"');
        await queryRunner.query('DROP INDEX "public"."idx_refresh_token_expiry"');
        await queryRunner.query('DROP INDEX "public"."idx_token_value_type_unique"');
        await queryRunner.query('DROP INDEX "public"."idx_token_invalidation"');
        await queryRunner.query('DROP INDEX "public"."idx_token_expiry"');
        await queryRunner.query('ALTER TABLE "two_factor_authentication_integration" ALTER COLUMN "ownerId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ADD CONSTRAINT "FK_193a665e6adcc639bc5e3fea884" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "refresh_token" ALTER COLUMN "ownerId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "single_use_token" ALTER COLUMN "ownerId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "single_use_token" ADD CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query('CREATE INDEX "IDX_c650599c2c931e7d7a9758a63c" ON "account" ("providerAccountId", "providerId") ');
        await queryRunner.query('CREATE INDEX "IDX_80c8c3a65607935e4e3fcc1cbe" ON "refresh_token" ("hashedValue") ');
        await queryRunner.query('CREATE INDEX "IDX_14e6f13b663a6acda7ae213d07" ON "single_use_token" ("value") ');
    }
}
