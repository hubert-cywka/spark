import { MigrationInterface, QueryRunner } from "typeorm";

export class SimplifyAttachments1767733325359 implements MigrationInterface {
    name = "SimplifyAttachments1767733325359";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" DROP COLUMN "part"');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" DROP COLUMN "nextPart"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ADD "nextPart" integer');
        await queryRunner.query('ALTER TABLE "export_attachment_manifest" ADD "part" integer NOT NULL');
    }
}
