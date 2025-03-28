import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOnCascade1743158756974 implements MigrationInterface {
    name = "DeleteOnCascade1743158756974";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "single_use_token" DROP CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3"');
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query(
            'ALTER TABLE "single_use_token" ADD CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3"');
        await queryRunner.query('ALTER TABLE "single_use_token" DROP CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3"');
        await queryRunner.query(
            'ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_05b033249cf1cf03e213d6c08e3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "single_use_token" ADD CONSTRAINT "FK_b9c387e9756b24ea74c2ec881b3" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
