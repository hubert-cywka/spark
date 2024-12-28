import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTimestampsFormat1735340489564 implements MigrationInterface {
    name = "ChangeTimestampsFormat1735340489564";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "processedAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "processedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "expiresAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "invalidatedAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "invalidatedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "usedAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "usedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "expiresAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "invalidatedAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "invalidatedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "activatedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "activatedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "termsAndConditionsAcceptedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "termsAndConditionsAcceptedAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "updatedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "termsAndConditionsAcceptedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "termsAndConditionsAcceptedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "activatedAt"');
        await queryRunner.query('ALTER TABLE "account" ADD "activatedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "invalidatedAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "invalidatedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP COLUMN "expiresAt"');
        await queryRunner.query('ALTER TABLE "refresh_token" ADD "expiresAt" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "usedAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "usedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "invalidatedAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "invalidatedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP COLUMN "expiresAt"');
        await queryRunner.query('ALTER TABLE "single_use_token" ADD "expiresAt" TIMESTAMP NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "processedAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "processedAt" TIMESTAMP');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "createdAt"');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "createdAt" TIMESTAMP NOT NULL');
    }
}
