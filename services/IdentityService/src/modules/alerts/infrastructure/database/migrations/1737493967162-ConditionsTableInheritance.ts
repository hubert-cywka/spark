import { MigrationInterface, QueryRunner } from "typeorm";

export class ConditionsTableInheritance1737493967162 implements MigrationInterface {
    name = "ConditionsTableInheritance1737493967162";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "condition" ADD "type" character varying NOT NULL');
        await queryRunner.query('CREATE INDEX "IDX_2f8e5387259b517960de4402da" ON "condition" ("type") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_2f8e5387259b517960de4402da"');
        await queryRunner.query('ALTER TABLE "condition" DROP COLUMN "type"');
    }
}
