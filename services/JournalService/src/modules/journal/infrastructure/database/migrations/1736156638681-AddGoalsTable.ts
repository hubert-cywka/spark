import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoalsTable1736156638681 implements MigrationInterface {
    name = "AddGoalsTable1736156638681";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isAccomplished" boolean NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" character varying NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('DROP TABLE "goal"');
    }
}
