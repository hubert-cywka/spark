import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeAlertsDatabase1737493814968 implements MigrationInterface {
    name = "InitializeAlertsDatabase1737493814968";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "condition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_f0f824897e3acf880a6e488b632" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "low_entries_condition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "minCount" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_72d5c3fba326b74f3af170d76a3" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "goal_deadline_condition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "daysBeforeDeadline" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_74834a18794efc67f078f9f3a27" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "always_condition_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_1847af0c9f3b59317b9d27c8cbd" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "alert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alertTime" TIMESTAMP WITH TIME ZONE NOT NULL, "condition" text NOT NULL, "lastTriggeredAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "condition" ADD CONSTRAINT "FK_709a5d880e66cde9ed9d0950232" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "low_entries_condition" ADD CONSTRAINT "FK_1c7d9b96530942133566434639e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "goal_deadline_condition" ADD CONSTRAINT "FK_bf612f47e1e868aad18dcab1f05" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "always_condition_entity" ADD CONSTRAINT "FK_ac0796ad72ce004bf0ab29c36aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c47ec76d2c5097d80eaae03853d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c47ec76d2c5097d80eaae03853d"');
        await queryRunner.query('ALTER TABLE "always_condition_entity" DROP CONSTRAINT "FK_ac0796ad72ce004bf0ab29c36aa"');
        await queryRunner.query('ALTER TABLE "goal_deadline_condition" DROP CONSTRAINT "FK_bf612f47e1e868aad18dcab1f05"');
        await queryRunner.query('ALTER TABLE "low_entries_condition" DROP CONSTRAINT "FK_1c7d9b96530942133566434639e"');
        await queryRunner.query('ALTER TABLE "condition" DROP CONSTRAINT "FK_709a5d880e66cde9ed9d0950232"');
        await queryRunner.query('DROP TABLE "alert"');
        await queryRunner.query('DROP TABLE "always_condition_entity"');
        await queryRunner.query('DROP TABLE "goal_deadline_condition"');
        await queryRunner.query('DROP TABLE "low_entries_condition"');
        await queryRunner.query('DROP TABLE "condition"');
        await queryRunner.query('DROP TABLE "user"');
    }
}
