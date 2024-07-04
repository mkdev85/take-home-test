import Joi from 'src/utils/joiDate';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_BOOK_ID } from 'src/utils/constants';

import { BorrowRecord } from 'src/entities/borrowRecords';
import { fieldsValidator } from 'src/utils/methodHelper';

const GetAllBorrowRecordsServiceSchema = Joi.object({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(5),
  searchByBookId: Joi.string().guid().message(INVALID_BOOK_ID),
});

interface IGetAllBorrowRecordsServiceParams {
  pageNumber: number;
  pageSize: number;
  searchByBookId: string;
}

class GetAllBorrowRecordsService {
  static async run(parameters: IGetAllBorrowRecordsServiceParams): ServiceResponseReturnType {
    try {
      const { pageNumber, pageSize, searchByBookId } = parameters;

      // Validating parameters
      const errors = fieldsValidator({
        schema: GetAllBorrowRecordsServiceSchema,
        fields: parameters,
      });

      if (errors) {
        return [errors];
      }

      const borrowRecordQuery = AppDataSource.getRepository(BorrowRecord)
        .createQueryBuilder('bookRecords')
        .leftJoinAndSelect('bookRecords.book', 'book')
        .select(['bookRecords', 'book.id', 'book.title']);

      if (searchByBookId) {
        borrowRecordQuery.where('bookRecords.book = :bookId', { bookId: searchByBookId });
      }

      const [borrowRecords, count] = await borrowRecordQuery
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return [null, { data: { borrowRecords, count, pageNumber, pageSize } }];
    } catch (error) {
      console.log('Error while fetching all borrow records items', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAllBorrowRecordsService;
