import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOnCascade1743158769846 implements MigrationInterface {
    name = "DeleteOnCascade1743158769846";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP CONSTRAINT "FK_3621ee453cc424a9a20650c99d4"');
        await queryRunner.query(
            'ALTER TABLE "data_purge_plan" ADD CONSTRAINT "FK_3621ee453cc424a9a20650c99d4" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_purge_plan" DROP CONSTRAINT "FK_3621ee453cc424a9a20650c99d4"');
        await queryRunner.query(
            'ALTER TABLE "data_purge_plan" ADD CONSTRAINT "FK_3621ee453cc424a9a20650c99d4" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
