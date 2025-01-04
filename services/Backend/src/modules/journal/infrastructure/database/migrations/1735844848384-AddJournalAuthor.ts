import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJournalAuthor1735844848384 implements MigrationInterface {
    name = "AddJournalAuthor1735844848384";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "author" ("id" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('ALTER TABLE "daily" ADD "authorId" character varying');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5"');
        await queryRunner.query('ALTER TABLE "daily" DROP COLUMN "id"');
        await queryRunner.query('ALTER TABLE "daily" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()');
        await queryRunner.query('ALTER TABLE "daily" ADD CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5" PRIMARY KEY ("id")');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5"');
        await queryRunner.query('ALTER TABLE "daily" DROP COLUMN "id"');
        await queryRunner.query('ALTER TABLE "daily" ADD "id" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "daily" ADD CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5" PRIMARY KEY ("id")');
        await queryRunner.query('ALTER TABLE "daily" DROP COLUMN "authorId"');
        await queryRunner.query('DROP TABLE "author"');
    }
}
