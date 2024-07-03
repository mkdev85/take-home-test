import Joi from 'joi';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_BOOK_ID } from 'src/utils/constants';
import { fieldsValidator } from 'src/utils/methodHelper';

import { Book } from 'src/entities/books';

const GetBookSchema = Joi.object({
  bookId: Joi.string().guid().message(INVALID_BOOK_ID),
});

interface IGetBookServiceParams {
  bookId: string;
}

class GetBookService {
  static async run({ bookId }: IGetBookServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: GetBookSchema,
        fields: { bookId },
      });

      if (errors) {
        return [errors];
      }

      const BookRepository = AppDataSource.getRepository(Book);

      // Fetch the book
      const book = await BookRepository.findOne({
        where: { id: bookId },
        relations: {
          author: true,
        },
        select: {
          author: {
            name: true,
            bio: true,
            birthdate: true,
          },
        },
      });

      if (!book) {
        return [
          {
            errorType: INTERNAL_SERVER_ERROR,
            message: INVALID_BOOK_ID,
          },
        ];
      }

      return [null, { data: book }];
    } catch (error) {
      console.log('Error while fetching the book', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetBookService;
