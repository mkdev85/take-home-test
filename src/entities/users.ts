import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { hash } from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    unique: true,
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  public email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  public first_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  public last_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public password: string;

  @BeforeInsert()
  public async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
