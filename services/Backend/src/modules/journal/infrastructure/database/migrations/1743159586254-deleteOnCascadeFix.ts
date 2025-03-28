import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOnCascadeFix1743159586254 implements MigrationInterface {
    name = "DeleteOnCascadeFix1743159586254";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b"');
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b"');
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
