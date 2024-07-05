import express from 'express';

import bookController from 'src/controllers/book.controller';
import Authenticate from 'src/middlewares/authenticate';

const args = { mergeParams: true };
const bookRouter = express.Router(args);

bookRouter.route('/').get(bookController.GetAllBooks);

bookRouter.route('/').post(Authenticate, bookController.CreateBook);

bookRouter.route('/:bookId').get(bookController.GetBook);

bookRouter.route('/:bookId').put(Authenticate, bookController.UpdateBook);

bookRouter.route('/:bookId').delete(Authenticate, bookController.DeleteBook);

export { bookRouter };
