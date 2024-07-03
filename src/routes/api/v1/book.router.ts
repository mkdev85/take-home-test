import express from 'express';

import bookController from 'src/controllers/book.controller';

const args = { mergeParams: true };
const bookRouter = express.Router(args);

bookRouter.route('/').post(bookController.CreateBook);

bookRouter.route('/:bookId').get(bookController.GetBook);

bookRouter.route('/:bookId').post(bookController.DeleteBook);

export { bookRouter };
