import { MigrationInterface, QueryRunner } from "typeorm";

export class Introduce2FA1743366087775 implements MigrationInterface {
    name = "Introduce2FA1743366087775";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "two_factor_authentication_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying NOT NULL, "secret" character varying NOT NULL, "enabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_4bee836dc40b9ddef08e88bfab3" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_option" ADD CONSTRAINT "FK_15e69c0c6eb6aefb4628eff9de0" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "two_factor_authentication_option" DROP CONSTRAINT "FK_15e69c0c6eb6aefb4628eff9de0"');
        await queryRunner.query('DROP TABLE "two_factor_authentication_option"');
    }
}
