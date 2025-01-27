import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFK1736180535854 implements MigrationInterface {
    name = "FixFK1736180535854";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
