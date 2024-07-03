import Joi from 'joi';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_BOOK_ID, UNAUTHORIZED } from 'src/utils/constants';

import type { ServiceResponseReturnType } from 'src/types';
import { Book } from 'src/entities/books';
import { fieldsValidator } from 'src/utils/methodHelper';

const DeleteBookSchema = Joi.object({
  bookId: Joi.string().guid().message(INVALID_BOOK_ID),
});

interface IDeleteBookServiceParams {
  bookId: string;
}

class DeleteBookService {
  static async run({ bookId }: IDeleteBookServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: DeleteBookSchema,
        fields: { bookId },
      });

      if (errors) {
        return [errors];
      }

      const BookRepository = AppDataSource.getRepository(Book);

      const bookData = await BookRepository.findOneBy({
        id: bookId,
      });

      if (!bookData) {
        return [
          {
            errorType: UNAUTHORIZED,
            message: INVALID_BOOK_ID,
          },
        ];
      }

      await BookRepository.delete({ id: bookId });

      return [null, { message: `Book '${bookData.title}' has been successfully deleted!` }];
    } catch (error) {
      console.log('Error while deleting an book', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default DeleteBookService;
