import Joi from 'src/utils/joiDate';

import { Author } from 'src/entities/authors';
import { Book } from 'src/entities/books';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_PARAMETER, INVALID_AUTHOR_ID } from 'src/utils/constants';

import type { ServiceResponseReturnType } from 'src/types';
import { fieldsValidator } from 'src/utils/methodHelper';

const CreateBookSchema = Joi.object({
  publishedYear: Joi.date().format('YYYY').raw().required(),
  title: Joi.string().trim().required(),
  genre: Joi.string().trim().required(),
  authorId: Joi.string().guid().message(INVALID_AUTHOR_ID).required(),
  availableCopies: Joi.number().min(0),
});

interface ICreateBookServiceParams {
  publishedYear: string;
  title: string;
  genre: string;
  authorId: string;
  availableCopies?: number;
}

class CreateBookService {
  static async run({
    publishedYear,
    title,
    genre,
    authorId,
    availableCopies,
  }: ICreateBookServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: CreateBookSchema,
        fields: { publishedYear, title, genre, authorId, availableCopies },
      });

      if (errors) {
        return [errors];
      }

      const AuthorRepository = AppDataSource.getRepository(Author);

      const authorData = await AuthorRepository.findOne({
        where: {
          id: authorId,
        },
      });

      if (!authorData?.name) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: INVALID_AUTHOR_ID,
          },
        ];
      }

      const BookRepository = AppDataSource.getRepository(Book);

      const book = new Book();
      book.title = title;
      book.genre = genre;
      book.publishedYear = Number(publishedYear);
      book.author = authorData;

      if (availableCopies) {
        book.availableCopies = availableCopies;
      }

      const newBookData = await BookRepository.save(book);

      return [
        null,
        {
          data: { title, genre, publishedYear, id: newBookData.id },
          message: `Book '${title}' has been successfully created!`,
        },
      ];
    } catch (error) {
      console.log('Error while creating a book', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default CreateBookService;
