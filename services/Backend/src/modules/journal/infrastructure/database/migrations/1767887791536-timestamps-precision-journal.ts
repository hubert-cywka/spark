import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionJournal1767887791536 implements MigrationInterface {
    name = "TimestampsPrecisionJournal1767887791536";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX \"public\".\"idx_goal_pagination\"");
        await queryRunner.query("ALTER TABLE \"goal\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"goal\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("DROP INDEX \"public\".\"idx_entry_pagination\"");
        await queryRunner.query("ALTER TABLE \"entry\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"entry\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"daily\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"daily\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"author\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"author\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(3) WITH TIME ZONE");
        await queryRunner.query("CREATE INDEX \"idx_goal_pagination\" ON \"goal\" (\"authorId\", \"createdAt\", \"id\") WHERE \"deletedAt\" IS NULL");
        await queryRunner.query("CREATE INDEX \"idx_entry_pagination\" ON \"entry\" (\"authorId\", \"createdAt\", \"id\") WHERE \"deletedAt\" IS NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX \"public\".\"idx_entry_pagination\"");
        await queryRunner.query("DROP INDEX \"public\".\"idx_goal_pagination\"");
        await queryRunner.query("ALTER TABLE \"author\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"author\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"daily\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"daily\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"entry\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"entry\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query(
            "CREATE INDEX \"idx_entry_pagination\" ON \"entry\" (\"authorId\", \"createdAt\", \"id\") WHERE (\"deletedAt\" IS NULL)"
        );
        await queryRunner.query("ALTER TABLE \"goal\" ALTER COLUMN \"updatedAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("ALTER TABLE \"goal\" ALTER COLUMN \"createdAt\" TYPE TIMESTAMP(6) WITH TIME ZONE");
        await queryRunner.query("CREATE INDEX \"idx_goal_pagination\" ON \"goal\" (\"authorId\", \"createdAt\", \"id\") WHERE (\"deletedAt\" IS NULL)");
    }
}
