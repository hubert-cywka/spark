import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381858935 implements MigrationInterface {
    name = "AddIndexes1767381858935";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE INDEX \"idx_job_execution_lookup\" ON \"job_execution\" (\"jobId\", \"executedAt\") ");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX \"public\".\"idx_job_execution_lookup\"");
    }
}
