import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsFeaturedFlagToEntries1740304775599 implements MigrationInterface {
    name = "AddIsFeaturedFlagToEntries1740304775599";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "entry" ADD "isFeatured" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "entry" DROP COLUMN "isFeatured"');
    }
}
