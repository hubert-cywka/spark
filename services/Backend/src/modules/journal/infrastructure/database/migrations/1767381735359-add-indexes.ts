import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381735359 implements MigrationInterface {
    name = "AddIndexes1767381735359";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE INDEX "idx_goal_deadline" ON "goal" ("authorId", "deadline") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_goal_name" ON "goal" ("authorId", "name") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_goal_pagination" ON "goal" ("authorId", "createdAt", "id") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_entry_daily" ON "entry" ("authorId", "dailyId") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_entry_is_featured" ON "entry" ("authorId", "isFeatured") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_entry_is_completed" ON "entry" ("authorId", "isCompleted") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_entry_pagination" ON "entry" ("authorId", "createdAt", "id") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_daily_active_author" ON "daily" ("authorId") WHERE "deletedAt" IS NULL');
        await queryRunner.query('CREATE INDEX "idx_daily_author_date" ON "daily" ("authorId", "date") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_daily_author_date"');
        await queryRunner.query('DROP INDEX "public"."idx_daily_active_author"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_pagination"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_is_completed"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_is_featured"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_daily"');
        await queryRunner.query('DROP INDEX "public"."idx_goal_pagination"');
        await queryRunner.query('DROP INDEX "public"."idx_goal_name"');
        await queryRunner.query('DROP INDEX "public"."idx_goal_deadline"');
    }
}
