import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameJoinTableForGoalAndEntries1737103643312 implements MigrationInterface {
    name = "RenameJoinTableForGoalAndEntries1737103643312";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "goal_entries" ("goalId" uuid NOT NULL, "entryId" uuid NOT NULL, CONSTRAINT "PK_0ba07e1b79a76be3d665539a1bf" PRIMARY KEY ("goalId", "entryId"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_6eeb5206b326e5fe7fc3be9442" ON "goal_entries" ("goalId") ');
        await queryRunner.query('CREATE INDEX "IDX_829077e61d9e7283cfbc9672b8" ON "goal_entries" ("entryId") ');
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_6eeb5206b326e5fe7fc3be9442d" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        );
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b"');
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_6eeb5206b326e5fe7fc3be9442d"');
        await queryRunner.query('DROP INDEX "public"."IDX_829077e61d9e7283cfbc9672b8"');
        await queryRunner.query('DROP INDEX "public"."IDX_6eeb5206b326e5fe7fc3be9442"');
        await queryRunner.query('DROP TABLE "goal_entries"');
    }
}
