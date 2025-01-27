import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCompletedFlagToEntries1737048686159 implements MigrationInterface {
    name = "AddIsCompletedFlagToEntries1737048686159";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "entry" ADD "isCompleted" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_11c46afafac068587c50b6ba2e6"');
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "dailyId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" SET NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_11c46afafac068587c50b6ba2e6" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_11c46afafac068587c50b6ba2e6"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "dailyId" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "authorId" DROP NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_11c46afafac068587c50b6ba2e6" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query('ALTER TABLE "entry" DROP COLUMN "isCompleted"');
    }
}
