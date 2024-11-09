import { MigrationInterface, QueryRunner } from "typeorm";

export class TermsAndConditionsTimestamp1731171265286 implements MigrationInterface {
    name = "TermsAndConditionsTimestamp1731171265286";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "account" ADD "termsAndConditionsAcceptedAt" TIMESTAMP');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "account" DROP COLUMN "termsAndConditionsAcceptedAt"');
    }
}
