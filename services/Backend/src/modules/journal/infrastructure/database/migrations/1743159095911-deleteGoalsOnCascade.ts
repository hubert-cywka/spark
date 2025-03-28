import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteGoalsOnCascade1743159095911 implements MigrationInterface {
    name = "DeleteGoalsOnCascade1743159095911";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
