import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorIdColumnInDailyEntity1735994132208 implements MigrationInterface {
    name = "AddAuthorIdColumnInDailyEntity1735994132208";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "daily" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "daily" ADD "date" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "daily" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "daily" ADD "date" date NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
