import express from 'express';

import bookController from 'src/controllers/book.controller';

const args = { mergeParams: true };
const bookRouter = express.Router(args);

bookRouter.route('/').get(bookController.GetAllBooks);

bookRouter.route('/').post(bookController.CreateBook);

bookRouter.route('/:bookId').get(bookController.GetBook);

bookRouter.route('/:bookId').put(bookController.UpdateBook);

bookRouter.route('/:bookId').delete(bookController.DeleteBook);

export { bookRouter };
