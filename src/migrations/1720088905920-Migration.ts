import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720088905920 implements MigrationInterface {
  name = 'Migration1720088905920'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "bio" character varying NOT NULL, "birthdate" date NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6c64b3df09e6774438aeca7e0b0" UNIQUE ("name"), CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "publishedYear" character varying NOT NULL, "genre" character varying NOT NULL, "availableCopies" integer NOT NULL DEFAULT '0', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "borrowrecords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "borrower" character varying NOT NULL, "borrowDate" date NOT NULL, "returnDate" date NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "bookId" uuid, CONSTRAINT "REL_e6eb857a863b7a00bb71fad553" UNIQUE ("bookId"), CONSTRAINT "PK_8eac1c685770646267132df5dcf" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(30) NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20) NOT NULL, "password" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_54f49efe2dd4d2850e736e9ab86" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "borrowrecords" ADD CONSTRAINT "FK_e6eb857a863b7a00bb71fad5535" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "borrowrecords" DROP CONSTRAINT "FK_e6eb857a863b7a00bb71fad5535"`);
    await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_54f49efe2dd4d2850e736e9ab86"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "borrowrecords"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "authors"`);
  }
}
