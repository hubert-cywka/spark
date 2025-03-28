import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOnCascade1743158742983 implements MigrationInterface {
    name = "DeleteOnCascade1743158742983";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "daily" DROP CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733"');
        await queryRunner.query('ALTER TABLE "entry" DROP CONSTRAINT "FK_95d6d669b3063a093f6d60293b3"');
        await queryRunner.query(
            'ALTER TABLE "daily" ADD CONSTRAINT "FK_b7c9dc5d31d58d9b918b8f48733" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "entry" ADD CONSTRAINT "FK_95d6d669b3063a093f6d60293b3" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
