import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionScheduling1767888113429 implements MigrationInterface {
    name = "TimestampsPrecisionScheduling1767888113429";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"job_schedule\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"job_schedule\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("DROP INDEX \"public\".\"idx_job_execution_lookup\"");
        await queryRunner.query("ALTER TABLE \"job_execution\" ALTER COLUMN \"executedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("CREATE INDEX \"idx_job_execution_lookup\" ON \"job_execution\" (\"jobId\", \"executedAt\") ");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX \"public\".\"idx_job_execution_lookup\"");
        await queryRunner.query("ALTER TABLE \"job_execution\" ALTER COLUMN \"executedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("CREATE INDEX \"idx_job_execution_lookup\" ON \"job_execution\" (\"executedAt\", \"jobId\") ");
        await queryRunner.query("ALTER TABLE \"job_schedule\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"job_schedule\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
    }
}
