import {
  Entity,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
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

  @OneToOne(type => Book)
  @JoinColumn()
  bookId: Book;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
