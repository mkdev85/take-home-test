import Joi from 'joi';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_PARAMETER, BOOK_NOT_FOUND } from 'src/utils/constants';
import { fieldsValidator } from 'src/utils/methodHelper';

import type { ServiceResponseReturnType } from 'src/types';
import { Book } from 'src/entities/books';

const UpdateBookSchema = Joi.object({
  publishedYear: Joi.string().trim(),
  title: Joi.string().trim(),
  genre: Joi.string().trim(),
  availableCopies: Joi.number().min(0).message('Available copies should not be negative'),
}).or('publishedYear', 'title', 'genre', 'availableCopies');

interface IUpdateBookServiceParams {
  publishedYear?: string;
  title?: string;
  genre?: string;
  bookId: string;
  availableCopies?: number;
}

class UpdateBookService {
  static async run({
    publishedYear,
    title,
    genre,
    bookId,
    availableCopies,
  }: IUpdateBookServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: UpdateBookSchema,
        fields: { publishedYear, title, genre, availableCopies },
      });

      if (errors) {
        return [errors];
      }

      const BookRepository = AppDataSource.getRepository(Book);

      // Check if book exists
      const bookData = (await BookRepository.findOne({
        where: {
          id: bookId,
        },
      }))!;

      if (!bookData) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: BOOK_NOT_FOUND,
          },
        ];
      }

      await BookRepository.save({
        id: bookId,
        title: title ?? bookData.title,
        genre: genre ?? bookData.genre,
        availableCopies: availableCopies ?? bookData.availableCopies,
      });

      return [
        null,
        {
          data: { title, genre, availableCopies },
          message: `Book '${title}' has been successfully updated!`,
        },
      ];
    } catch (error) {
      console.log('Error while updating an book', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default UpdateBookService;
