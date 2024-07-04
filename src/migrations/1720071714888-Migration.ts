import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1720071714888 implements MigrationInterface {
  name = 'Migration1720071714888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authors" ADD CONSTRAINT "UQ_6c64b3df09e6774438aeca7e0b0" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authors" DROP CONSTRAINT "UQ_6c64b3df09e6774438aeca7e0b0"`,
    );
  }
}
