import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDailyEntity1735843548123 implements MigrationInterface {
    name = "AddDailyEntity1735843548123";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "daily" ("id" character varying NOT NULL, "date" date NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "daily"');
    }
}
