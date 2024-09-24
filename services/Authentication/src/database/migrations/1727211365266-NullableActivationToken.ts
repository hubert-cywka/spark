import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableActivationToken1727211365266 implements MigrationInterface {
    name = "NullableActivationToken1727211365266";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "activationToken" DROP NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "activationToken" SET NOT NULL');
    }
}
