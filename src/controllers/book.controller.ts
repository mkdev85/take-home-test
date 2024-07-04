import type { Response } from 'express';

import CreateBookService from 'src/services/book/createBook';
import DeleteBookService from 'src/services/book/deleteBook';
import GetBookService from 'src/services/book/getBook';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';
import GetAllBoooksService from 'src/services/book/getAllBooks';
import UpdateBookService from 'src/services/book/updateBook';

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

  static async GetAllBooks(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetAllBoooksService,
      parameters: {
        authorId: request.query.author_id,
        pageNumber: Number(request.query.page_number) || 1,
        pageSize: Number(request.query.page_size) || 20,
        title: request.query.title,
        genre: request.query.genre,
        publishedYear: request.query.published_year,
        sortBydate: request.query.sort_by_date,
        sortByPublishedYear: request.query.sort_by_published_year
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
        availableCopies: request.body.availableCopies,
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

  static async UpdateBook(request: CustomRequest, response: Response) {
    sendResponse({
      service: UpdateBookService,
      parameters: {
        publishedYear: request.body.publishedYear,
        title: request.body.title,
        genre: request.body.genre,
        bookId: request.params.bookId,
        availableCopies: request.body.availableCopies,
      },
      response,
    });
  }
}

export default BooksController;
