import express from 'express';

import borrowRecordController from 'src/controllers/borrowRecords.controller';
import Authenticate from 'src/middlewares/authenticate';

const args = { mergeParams: true };
const borrowRecordRouter = express.Router(args);

borrowRecordRouter.route('/').get(borrowRecordController.GetAllBorrowRecords);

borrowRecordRouter.route('/').post(Authenticate, borrowRecordController.CreateBorrowRecord);

borrowRecordRouter.route('/:borrowRecordId').get(borrowRecordController.GetBorrowRecord);

borrowRecordRouter
  .route('/:borrowRecordId')
  .put(Authenticate, borrowRecordController.UpdateBorrowRecord);

borrowRecordRouter
  .route('/:borrowRecordId')
  .delete(Authenticate, borrowRecordController.DeleteBorrowRecord);

export { borrowRecordRouter };
