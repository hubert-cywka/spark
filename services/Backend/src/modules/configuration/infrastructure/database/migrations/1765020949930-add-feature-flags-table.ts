import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureFlagsTable1765020949930 implements MigrationInterface {
    name = "AddFeatureFlagsTable1765020949930";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE \"feature_flag\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"key\" character varying NOT NULL, \"value\" boolean NOT NULL DEFAULT false, \"tenantId\" uuid NOT NULL, \"createdAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"UQ_49b0237d95e9f0164218ecafd52\" UNIQUE (\"key\", \"tenantId\"), CONSTRAINT \"PK_f390205410d884907604a90c0f4\" PRIMARY KEY (\"id\"))"
        );
        await queryRunner.query(
            "ALTER TABLE \"feature_flag\" ADD CONSTRAINT \"FK_6d71049e9b27b7c73c266168c64\" FOREIGN KEY (\"tenantId\") REFERENCES \"tenant\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"feature_flag\" DROP CONSTRAINT \"FK_6d71049e9b27b7c73c266168c64\"");
        await queryRunner.query("DROP TABLE \"feature_flag\"");
    }
}
