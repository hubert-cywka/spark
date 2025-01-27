import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultValueForIsAccomplished1736157185323 implements MigrationInterface {
    name = "DefaultValueForIsAccomplished1736157185323";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "isAccomplished" SET DEFAULT false');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goal" ALTER COLUMN "isAccomplished" DROP DEFAULT');
    }
}
