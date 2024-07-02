import express from 'express';

import { authorRouter } from './author.router';
// import { bookRouter } from './book.router';
// import { borrowRecordRouter } from './borrowRecords.router';

const router = express.Router();
const NAMESPACE = 'v1';

router.use(`/${NAMESPACE}/authors`, authorRouter);
// router.use(`/${NAMESPACE}/books`, bookRouter);
// router.use(`/${NAMESPACE}/borrow-records`, borrowRecordRouter);

export default router;
