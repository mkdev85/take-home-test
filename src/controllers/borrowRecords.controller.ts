import type { Response } from 'express';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';
import CreateBorrowRecordService from 'src/services/borrowRecords/createBorrowRecord';

class BorrowRecordController {
  static async CreateBorrowRecord(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateBorrowRecordService,
      parameters: {
        returnDate: request.body.returnDate,
        borrowDate: request.body.borrowDate,
        borrower: request.body.borrower,
        bookId: request.body.bookId
      },
      response,
    });
  }
}

export default BorrowRecordController;
