import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateToEntries1767904875178 implements MigrationInterface {
    name = "AddDateToEntries1767904875178";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_11c46afafac068587c50b6ba2e6"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_daily"');
        await queryRunner.query('ALTER TABLE "entry" RENAME COLUMN "dailyId" TO "date"');
        await queryRunner.query('DROP INDEX "public"."idx_goal_deadline"');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "deadline" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "entry" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "entry" ADD "date" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_goal_deadline" ON "goal" ("authorId", "deadline") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_entry_date" ON "entry" ("authorId", "date") WHERE "deletedAt" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_entry_date"');
        await queryRunner.query('DROP INDEX "public"."idx_goal_deadline"');
        await queryRunner.query('ALTER TABLE "daily" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "entry" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "entry" DROP COLUMN "date"');
        await queryRunner.query('ALTER TABLE "entry" ADD "date" uuid NOT NULL');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "deadline" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_goal_deadline" ON "goal" ("authorId", "deadline") WHERE ("deletedAt" IS NULL)');
        await queryRunner.query('ALTER TABLE "entry" RENAME COLUMN "date" TO "dailyId"');
        await queryRunner.query('CREATE INDEX "idx_entry_daily" ON "entry" ("authorId", "dailyId") WHERE ("deletedAt" IS NULL)');
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_11c46afafac068587c50b6ba2e6" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
