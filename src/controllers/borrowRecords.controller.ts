import type { Response } from 'express';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';
import CreateBorrowRecordService from 'src/services/borrowRecords/createBorrowRecord';
import DeleteBorrowRecordService from 'src/services/borrowRecords/deleteBorrowrecord';
import GetBorrowRecordService from 'src/services/borrowRecords/getBorrowRecord';
import GetAllBorrowRecordsService from 'src/services/borrowRecords/getAllBorrowRecords';
import UpdateBorrowRecordService from 'src/services/borrowRecords/updateBorrowRecord';

class BorrowRecordController {
  static async GetBorrowRecord(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetBorrowRecordService,
      parameters: {
        borrowRecordId: request.params.borrowRecordId,
      },
      response,
    });
  }

  static async GetAllBorrowRecords(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetAllBorrowRecordsService,
      parameters: {
        pageNumber: Number(request.query.page_number) || 1,
        pageSize: Number(request.query.page_size) || 20,
        searchByBookId: request.query.book_id,
      },
      response,
    });
  }

  static async CreateBorrowRecord(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateBorrowRecordService,
      parameters: {
        returnDate: request.body.returnDate,
        borrowDate: request.body.borrowDate,
        borrower: request.body.borrower,
        bookId: request.body.bookId,
      },
      response,
    });
  }

  static async DeleteBorrowRecord(request: CustomRequest, response: Response) {
    sendResponse({
      service: DeleteBorrowRecordService,
      parameters: {
        borrowRecordId: request.params.borrowRecordId,
      },
      response,
    });
  }

  static async UpdateBorrowRecord(request: CustomRequest, response: Response) {
    sendResponse({
      service: UpdateBorrowRecordService,
      parameters: {
        borrowRecordId: request.params.borrowRecordId,
        returnDate: request.body.returnDate,
      },
      response,
    });
  }
}

export default BorrowRecordController;
