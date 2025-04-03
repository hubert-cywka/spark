import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTTLFor2FAIntegrations1743713719361 implements MigrationInterface {
    name = "AddTTLFor2FAIntegrations1743713719361";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "two_factor_authentication_integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying NOT NULL, "secret" character varying NOT NULL, "totpTTL" integer NOT NULL DEFAULT \'30\', "enabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_afb2604a3b4b0fbb7821f038901" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'ALTER TABLE "two_factor_authentication_integration" ADD CONSTRAINT "FK_193a665e6adcc639bc5e3fea884" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "two_factor_authentication_integration" DROP CONSTRAINT "FK_193a665e6adcc639bc5e3fea884"');
        await queryRunner.query('DROP TABLE "two_factor_authentication_integration"');
    }
}
