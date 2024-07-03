import type { Response } from 'express';

import CreateBookService from 'src/services/book/createBook';
import DeleteBookService from 'src/services/book/deleteBook';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';

class BooksController {
  static async CreateBook(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateBookService,
      parameters: {
        name: request.body.name,
        bio: request.body.bio,
        birthDate: request.body.birthDate,
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
