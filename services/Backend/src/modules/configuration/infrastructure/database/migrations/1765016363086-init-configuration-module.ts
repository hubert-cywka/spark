import { MigrationInterface, QueryRunner } from "typeorm";

export class InitConfigurationModule1765016363086 implements MigrationInterface {
    name = "InitConfigurationModule1765016363086"
 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE \"tenant\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_da8c6efd67bb301e810e56ac139\" PRIMARY KEY (\"id\"))");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE \"tenant\"");
    }

}
