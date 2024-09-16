import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1726517504746 implements MigrationInterface {
    name = "InitTables1726517504746";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ');
        await queryRunner.query(
            'CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "invalidatedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "UQ_7f2bc25df3afe0d69f71bd61705" UNIQUE ("value"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_7f2bc25df3afe0d69f71bd6170" ON "refresh_token" ("value") ');
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query('DROP INDEX "public"."IDX_7f2bc25df3afe0d69f71bd6170"');
        await queryRunner.query('DROP TABLE "refresh_token"');
        await queryRunner.query('DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"');
        await queryRunner.query('DROP TABLE "user"');
    }
}
