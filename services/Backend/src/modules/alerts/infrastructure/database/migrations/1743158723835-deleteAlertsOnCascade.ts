import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteAlertsOnCascade1743158723835 implements MigrationInterface {
    name = "DeleteAlertsOnCascade1743158723835";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f"');
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f" FOREIGN KEY ("recipientId") REFERENCES "recipient"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f"');
        await queryRunner.query(
            'ALTER TABLE "alert" ADD CONSTRAINT "FK_c4c34f2d9b98a90e21b640e898f" FOREIGN KEY ("recipientId") REFERENCES "recipient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
