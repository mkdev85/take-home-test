import type { Response } from 'express';

import CreateBookService from 'src/services/book/createBook';
import DeleteBookService from 'src/services/book/deleteBook';
import GetBookService from 'src/services/book/getBook';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';

class BooksController {
  static async GetBook(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetBookService,
      parameters: {
        bookId: request.params.bookId,
      },
      response,
    });
  }

  static async CreateBook(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateBookService,
      parameters: {
        publishedYear: request.body.publishedYear,
        title: request.body.title,
        genre: request.body.genre,
        authorId: request.body.authorId,
        availableCopies: request.body.availableCopies
      },
      response,
    });
  }

  static async DeleteBook(request: CustomRequest, response: Response) {
    sendResponse({
      service: DeleteBookService,
      parameters: {
        bookId: request.params.bookId,
      },
      response,
    });
  }
}

export default BooksController;
