import Joi from 'src/utils/joiDate';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  ASCENDING_ORDER_TYPE,
  DESCENDING_ORDER_TYPE,
  INTERNAL_SERVER_ERROR,
  INVALID_AUTHOR_ID,
} from 'src/utils/constants';

import { Brackets } from 'typeorm';
import { Book } from 'src/entities/books';
import { fieldsValidator } from 'src/utils/methodHelper';

const GetAllBooksServiceSchema = Joi.object({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(5),
  title: Joi.string().trim(),
  genre: Joi.string().trim(),
  publishedYear: Joi.string().trim(),
  authorId: Joi.string().guid().message(INVALID_AUTHOR_ID),
  sortByDate: Joi.string().valid('DESC', 'ASC'),
  sortByPublishedYear: Joi.string().trim(),
});

interface IGetAllBooksServiceParams {
  pageNumber: number;
  pageSize: number;
  title?: string;
  genre?: string;
  publishedYear?: string;
  authorId?: string;
  sortByDate?: string;
  sortByPublishedYear?: string;
}

class GetAllBoooksService {
  static async run(parameters: IGetAllBooksServiceParams): ServiceResponseReturnType {
    try {
      const {
        pageNumber,
        pageSize,
        title,
        genre,
        publishedYear,
        authorId,
        sortByDate,
        sortByPublishedYear,
      } = parameters;

      // Validating parameters
      const errors = fieldsValidator({
        schema: GetAllBooksServiceSchema,
        fields: parameters,
      });

      if (errors) {
        return [errors];
      }

      const bookQuery = AppDataSource.getRepository(Book)
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author');

      if (authorId) {
        bookQuery.where('book.author = :authorId', { authorId });
      }

      if (title?.trim()) {
        bookQuery.andWhere(
          new Brackets(qb => {
            qb.where('book.title ILike :search', {
              search: `%${title}%`,
            });
          }),
        );
      }

      if (genre?.trim()) {
        bookQuery.andWhere(
          new Brackets(qb => {
            qb.where('book.genre = :genre', {
              genre,
            });
          }),
        );
      }

      if (publishedYear?.trim()) {
        bookQuery.andWhere(
          new Brackets(qb => {
            qb.where('book.publishedYear = :publishedYear', {
              publishedYear,
            });
          }),
        );
      }

      if (sortByDate) {
        bookQuery.orderBy({
          'book.created_date':
            sortByDate === DESCENDING_ORDER_TYPE ? DESCENDING_ORDER_TYPE : ASCENDING_ORDER_TYPE,
        });
      }

      if (sortByPublishedYear) {
        bookQuery.orderBy({
          'book.publishedYear':
            sortByPublishedYear === DESCENDING_ORDER_TYPE
              ? DESCENDING_ORDER_TYPE
              : ASCENDING_ORDER_TYPE,
        });
      }

      const [books, count] = await bookQuery
        .select(['book', 'author.id', 'author.name'])
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return [null, { data: { books, count, pageNumber, pageSize, sortByDate } }];
    } catch (error) {
      console.log('Error while fetching all book items', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAllBoooksService;
