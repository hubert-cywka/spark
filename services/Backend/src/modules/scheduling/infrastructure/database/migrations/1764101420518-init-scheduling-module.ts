import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchedulingModule1764101420518 implements MigrationInterface {
    name = "InitSchedulingModule1764101420518";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE \"job_schedule\" (\"id\" character varying NOT NULL, \"interval\" integer NOT NULL, \"callbackTopic\" character varying NOT NULL, \"callbackSubject\" character varying NOT NULL, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_9e741b6be1199a16ccd3d131c47\" PRIMARY KEY (\"id\"))"
        );
        await queryRunner.query(
            "CREATE TABLE \"job_execution\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"jobId\" character varying NOT NULL, \"executedAt\" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT \"PK_81e54343e6d62f09a166d105792\" PRIMARY KEY (\"id\"))"
        );
        await queryRunner.query(
            "ALTER TABLE \"job_execution\" ADD CONSTRAINT \"FK_6f342ebe2b66a1c613516efa7db\" FOREIGN KEY (\"jobId\") REFERENCES \"job_schedule\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"job_execution\" DROP CONSTRAINT \"FK_6f342ebe2b66a1c613516efa7db\"");
        await queryRunner.query("DROP TABLE \"job_execution\"");
        await queryRunner.query("DROP TABLE \"job_schedule\"");
    }
}
