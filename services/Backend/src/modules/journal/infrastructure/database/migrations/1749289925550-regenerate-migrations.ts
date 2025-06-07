import { MigrationInterface, QueryRunner } from "typeorm";

export class RegenerateMigrations1749289925550 implements MigrationInterface {
    name = "RegenerateMigrations1749289925550";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "target" smallint NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" character varying NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "isFeatured" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" character varying NOT NULL, "dailyId" uuid NOT NULL, CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "daily" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" character varying NOT NULL, CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "author" ("id" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "goal_entries" ("goalId" uuid NOT NULL, "entryId" uuid NOT NULL, CONSTRAINT "PK_0ba07e1b79a76be3d665539a1bf" PRIMARY KEY ("goalId", "entryId"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_6eeb5206b326e5fe7fc3be9442" ON "goal_entries" ("goalId") ');
        await queryRunner.query('CREATE INDEX "IDX_829077e61d9e7283cfbc9672b8" ON "goal_entries" ("entryId") ');
        await queryRunner.query(
            'ALTER TABLE "goal" ADD CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_11c46afafac068587c50b6ba2e6" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_6eeb5206b326e5fe7fc3be9442d" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        );
        await queryRunner.query(
            'ALTER TABLE "goal_entries" ADD CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_829077e61d9e7283cfbc9672b8b"');
        await queryRunner.query('ALTER TABLE "goal_entries" DROP CONSTRAINT "FK_6eeb5206b326e5fe7fc3be9442d"');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_11c46afafac068587c50b6ba2e6"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query('ALTER TABLE "goal" DROP CONSTRAINT "FK_7d0b871ca3edfe06068167f01b8"');
        await queryRunner.query('DROP INDEX "public"."IDX_829077e61d9e7283cfbc9672b8"');
        await queryRunner.query('DROP INDEX "public"."IDX_6eeb5206b326e5fe7fc3be9442"');
        await queryRunner.query('DROP TABLE "goal_entries"');
        await queryRunner.query('DROP TABLE "author"');
        await queryRunner.query('DROP TABLE "daily"');
        await queryRunner.query('DROP TABLE "entry"');
        await queryRunner.query('DROP TABLE "goal"');
    }
}
