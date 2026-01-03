import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveIndexes1767428462687 implements MigrationInterface {
    name = "ImproveIndexes1767428462687";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_entry_is_featured"');
        await queryRunner.query('DROP INDEX "public"."idx_entry_is_completed"');
        await queryRunner.query('DROP INDEX "public"."idx_daily_active_author"');
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE INDEX "idx_daily_active_author" ON "daily" ("authorId") WHERE ("deletedAt" IS NULL)');
        await queryRunner.query('CREATE INDEX "idx_entry_is_completed" ON "entry" ("authorId", "isCompleted") WHERE ("deletedAt" IS NULL)');
        await queryRunner.query('CREATE INDEX "idx_entry_is_featured" ON "entry" ("authorId", "isFeatured") WHERE ("deletedAt" IS NULL)');
    }
}
