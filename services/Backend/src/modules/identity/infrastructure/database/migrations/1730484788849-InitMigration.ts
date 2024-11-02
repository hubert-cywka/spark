import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1730484788849 implements MigrationInterface {
    name = "InitMigration1730484788849";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "single_use_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "type" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "invalidatedAt" TIMESTAMP, "usedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "UQ_14e6f13b663a6acda7ae213d075" UNIQUE ("value"), CONSTRAINT "PK_e2be3b618427b72ac6487b42613" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_14e6f13b663a6acda7ae213d07" ON "single_use_token" ("value") ');
        await queryRunner.query(
            'CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "invalidatedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "UQ_7f2bc25df3afe0d69f71bd61705" UNIQUE ("value"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_7f2bc25df3afe0d69f71bd6170" ON "refresh_token" ("value") ');
        await queryRunner.query(
            'CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "activatedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_4c8f96ccf523e9a3faefd5bdd4" ON "account" ("email") ');
        await queryRunner.query(
            'ALTER TABLE "single_use_token" ADD CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3"');
        await queryRunner.query('DROP INDEX "public"."IDX_4c8f96ccf523e9a3faefd5bdd4"');
        await queryRunner.query('DROP TABLE "account"');
        await queryRunner.query('DROP INDEX "public"."IDX_7f2bc25df3afe0d69f71bd6170"');
        await queryRunner.query('DROP TABLE "refresh_token"');
        await queryRunner.query('DROP INDEX "public"."IDX_14e6f13b663a6acda7ae213d07"');
        await queryRunner.query('DROP TABLE "single_use_token"');
    }
}
