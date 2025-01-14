import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntryEntity1736876093309 implements MigrationInterface {
    name = "AddEntryEntity1736876093309";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" character varying, "dailyId" uuid, CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_11c46afafac068587c50b6ba2e6" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_11c46afafac068587c50b6ba2e6"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query('DROP TABLE "entry"');
    }
}
