import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1720076910335 implements MigrationInterface {
  name = 'Migration1720076910335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "borrowrecords" DROP CONSTRAINT "FK_7efd12b8973f4e65a7296a27ead"`,
    );
    await queryRunner.query(`ALTER TABLE "borrowrecords" RENAME COLUMN "bookIdId" TO "bookId"`);
    await queryRunner.query(
      `ALTER TABLE "borrowrecords" ADD CONSTRAINT "FK_e6eb857a863b7a00bb71fad5535" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "borrowrecords" DROP CONSTRAINT "FK_e6eb857a863b7a00bb71fad5535"`,
    );
    await queryRunner.query(`ALTER TABLE "borrowrecords" RENAME COLUMN "bookId" TO "bookIdId"`);
    await queryRunner.query(
      `ALTER TABLE "borrowrecords" ADD CONSTRAINT "FK_7efd12b8973f4e65a7296a27ead" FOREIGN KEY ("bookIdId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
