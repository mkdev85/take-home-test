import express from 'express';

import borrowRecordController from 'src/controllers/borrowRecords.controller';
const args = { mergeParams: true };
const borrowRecordRouter = express.Router(args);

borrowRecordRouter.route('/').get(borrowRecordController.GetAllBorrowRecords);

borrowRecordRouter.route('/').post(borrowRecordController.CreateBorrowRecord);

borrowRecordRouter.route('/:borrowRecordId').get(borrowRecordController.GetBorrowRecord);

borrowRecordRouter.route('/:borrowRecordId').put(borrowRecordController.UpdateBorrowRecord);

borrowRecordRouter.route('/:borrowRecordId').delete(borrowRecordController.DeleteBorrowRecord);

export { borrowRecordRouter };
