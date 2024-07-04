import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR } from 'src/utils/constants';

import { BorrowRecord } from 'src/entities/borrowRecords';

interface IGetAllBorrowRecordsServiceParams {
  pageNumber: number;
  pageSize: number;
  searchByBookId: string;
}

class GetAllBorrowRecordsService {
  static async run(parameters: IGetAllBorrowRecordsServiceParams): ServiceResponseReturnType {
    try {
      const { pageNumber, pageSize, searchByBookId } = parameters;

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
