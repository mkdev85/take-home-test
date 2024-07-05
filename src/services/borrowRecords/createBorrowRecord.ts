import Joi from 'src/utils/joiDate';

import { Book } from 'src/entities/books';
import { BorrowRecord } from 'src/entities/borrowRecords';

import { AppDataSource } from 'src/utils/data-source';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_PARAMETER,
  INVALID_BOOK_ID,
  BORROW_RECORD_ALREADY_EXIST,
  INVALID_BORROW_RECORD_BORROW_DATE,
  INVALID_BORROW_RECORD_RETURN_DATE,
} from 'src/utils/constants';
import { fieldsValidator, isBorrowDateValid, isReturnDateValid } from 'src/utils/methodHelper';

import type { ServiceResponseReturnType } from 'src/types';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const CreateBorrowRecordSchema = Joi.object({
  returnDate: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('borrowDate')).required(),
  borrowDate: Joi.date().format('YYYY-MM-DD').raw().required(),
  borrower: Joi.string().trim().required(),
  bookId: Joi.string().guid().message(INVALID_BOOK_ID).required(),
});

interface ICreateBorrowRecordServiceParams {
  returnDate: string;
  borrowDate: string;
  borrower: string;
  bookId: string;
}

class CreateBorrowRecordService {
  static async run({
    returnDate,
    borrowDate,
    borrower,
    bookId,
  }: ICreateBorrowRecordServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: CreateBorrowRecordSchema,
        fields: { returnDate, borrowDate, borrower, bookId },
      });

      if (errors) {
        return [errors];
      }

      if (!isBorrowDateValid(borrowDate)) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: INVALID_BORROW_RECORD_BORROW_DATE,
          },
        ];
      }

      if (!isReturnDateValid(returnDate)) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: INVALID_BORROW_RECORD_RETURN_DATE,
          },
        ];
      }

      const BookRepository = AppDataSource.getRepository(Book);

      const bookData = await BookRepository.findOne({
        where: {
          id: bookId,
        },
      });

      if (!bookData?.id) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: INVALID_BOOK_ID,
          },
        ];
      }

      const BorrowRecordRepository = AppDataSource.getRepository(BorrowRecord);

      const oldBorrowRecords = await BorrowRecordRepository.findOne({
        where: [
          {
            book: { id: bookId },
            borrowDate: Between(borrowDate, returnDate),
          },
          {
            book: { id: bookId },
            borrowDate: MoreThanOrEqual(borrowDate),
            returnDate: LessThanOrEqual(returnDate),
          },
        ],
      });

      if (oldBorrowRecords?.id) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: BORROW_RECORD_ALREADY_EXIST,
          },
        ];
      }

      const borrowRecord = new BorrowRecord();
      borrowRecord.returnDate = returnDate;
      borrowRecord.borrowDate = borrowDate;
      borrowRecord.borrower = borrower;
      borrowRecord.book = bookData;

      const newBorrowData = await BorrowRecordRepository.save(borrowRecord);

      return [
        null,
        {
          data: {
            returnDate,
            borrowDate,
            borrower,
            book: { id: bookData.id, title: bookData.title },
            id: newBorrowData.id,
          },
          message: `Borrow Record has been successfully created!`,
        },
      ];
    } catch (error) {
      console.log('Error while creating a borrow record', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default CreateBorrowRecordService;
