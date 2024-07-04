import Joi from 'src/utils/joiDate';

import { Book } from 'src/entities/books';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_PARAMETER, INVALID_BOOK_ID } from 'src/utils/constants';

import { fieldsValidator } from 'src/utils/methodHelper';

import type { ServiceResponseReturnType } from 'src/types';
import { BorrowRecord } from 'src/entities/borrowRecords';

const CreateBorrowRecordSchema = Joi.object({
  returnDate: Joi.date().format('YYYY-MM-DD').raw().required(),
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

      const borrowRecord = new BorrowRecord();
      borrowRecord.returnDate = returnDate;
      borrowRecord.borrowDate = borrowDate;
      borrowRecord.borrower = borrower;
      borrowRecord.bookId = bookData;

      const newBorrowData = await BorrowRecordRepository.save(borrowRecord);

      return [
        null,
        {
          data: { returnDate, borrowDate, borrower, bookId, id: newBorrowData.id },
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
