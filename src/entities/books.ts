import {
  Entity,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Author } from './authors';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Author, author => author.books, { nullable: false, onDelete: 'CASCADE' })
  author: Author;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'int' })
  publishedYear: number;

  @Column({ nullable: false, type: 'varchar' })
  genre: string;

  @Column({ nullable: false, default: 0 })
  availableCopies: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
