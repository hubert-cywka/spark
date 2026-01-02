import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381872552 implements MigrationInterface {
    name = "AddIndexes1767381872552";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE INDEX \"idx_data_purge_tenant_active\" ON \"data_purge_plan\" (\"tenantId\") WHERE \"cancelledAt\" IS NULL AND \"processedAt\" IS NULL"
        );
        await queryRunner.query(
            "CREATE INDEX \"idx_data_purge_processing\" ON \"data_purge_plan\" (\"removeAt\") WHERE \"cancelledAt\" IS NULL AND \"processedAt\" IS NULL"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX \"public\".\"idx_data_purge_processing\"");
        await queryRunner.query("DROP INDEX \"public\".\"idx_data_purge_tenant_active\"");
    }
}
