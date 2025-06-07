import { MigrationInterface, QueryRunner } from "typeorm";

export class RegenerateMigrations1749289896371 implements MigrationInterface {
    name = "RegenerateMigrations1749289896371";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "recipient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_9f7a695711b2055e3c8d5cfcfa1" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "alert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "enabled" boolean NOT NULL, "time" TIME NOT NULL, "daysOfWeek" integer array NOT NULL, "recipientId" uuid NOT NULL, "nextTriggerAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f" FOREIGN KEY ("recipientId") REFERENCES "recipient"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f"');
        await queryRunner.query('DROP TABLE "alert"');
        await queryRunner.query('DROP TABLE "recipient"');
    }
}
