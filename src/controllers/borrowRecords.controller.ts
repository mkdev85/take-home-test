import type { Response } from 'express';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';
import CreateBorrowRecordService from 'src/services/borrowRecords/createBorrowRecord';
import DeleteBorrowRecordService from 'src/services/borrowRecords/deleteBorrowrecord';
import GetBorrowRecordService from 'src/services/borrowRecords/getBorrowRecord';

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
}

export default BorrowRecordController;
