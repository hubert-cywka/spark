import { MigrationInterface, QueryRunner } from "typeorm";

export class RegenerateMigrations1749289938815 implements MigrationInterface {
    name = "RegenerateMigrations1749289938815";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "recipient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "PK_9f7a695711b2055e3c8d5cfcfa1" PRIMARY KEY ("id"))'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "recipient"');
    }
}
