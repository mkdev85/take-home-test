import {
  Entity,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Author } from './authors';
import { BorrowRecord } from './borrowRecords';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'int' })
  publishedYear: number;

  @Column({ nullable: false, type: 'varchar' })
  genre: string;

  @Column({ nullable: false, default: 0 })
  availableCopies: number;

  @ManyToOne(() => Author, author => author.books, { nullable: false, onDelete: 'CASCADE' })
  author: Author;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.book, { cascade: true })
  borrowRecords: BorrowRecord[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
