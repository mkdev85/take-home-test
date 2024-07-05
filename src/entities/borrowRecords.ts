import {
  Entity,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { Book } from './books';

@Entity('borrowrecords')
export class BorrowRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  borrower: string;

  @Column({ nullable: false, type: 'date' })
  borrowDate: string;

  @Column({ nullable: false, type: 'date' })
  returnDate: string;

  @ManyToOne(() => Book, book => book.borrowRecords, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
