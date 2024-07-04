import express from 'express';

import borrowRecordController from 'src/controllers/borrowRecords.controller';

const args = { mergeParams: true };
const borrowRecordRouter = express.Router(args);

borrowRecordRouter.route('/').post(borrowRecordController.CreateBorrowRecord);

export { borrowRecordRouter };
