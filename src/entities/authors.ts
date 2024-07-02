import {
  Entity,
  CreateDateColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from './books';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', unique: true })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  bio: string;

  @Column({ nullable: false, type: 'date'})
  birthdate: string;

  @OneToMany(type => Book, book => book.author)
  books: Book[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
