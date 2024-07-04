import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  ASCENDING_ORDER_TYPE,
  DESCENDING_ORDER_TYPE,
  INTERNAL_SERVER_ERROR,
} from 'src/utils/constants';

import { Brackets } from 'typeorm';
import { Book } from 'src/entities/books';

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
      const { pageNumber, pageSize, title, genre, publishedYear, authorId, sortByDate, sortByPublishedYear } =
        parameters;

      const bookQuery = AppDataSource.getRepository(Book).createQueryBuilder('book').leftJoinAndSelect('book.author', 'author');

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
            sortByPublishedYear === DESCENDING_ORDER_TYPE ? DESCENDING_ORDER_TYPE : ASCENDING_ORDER_TYPE,
        });
      }

      const [books, count] = await bookQuery.select(['book', 'author.id', 'author.name'])
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
