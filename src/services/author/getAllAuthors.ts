import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  ASCENDING_ORDER_TYPE,
  DESCENDING_ORDER_TYPE,
  INTERNAL_SERVER_ERROR,
} from 'src/utils/constants';

import { Author } from 'src/entities/authors';
import { Brackets } from 'typeorm';

interface IGetAllAuthorsServiceParams {
  pageNumber: number;
  pageSize: number;
  searchByTitle?: string;
  sortByDate?: string;
}

class GetAllAuthorsService {
  static async run(parameters: IGetAllAuthorsServiceParams): ServiceResponseReturnType {
    try {
      const {
        pageNumber,
        pageSize,
        searchByTitle,
        sortByDate
      } = parameters;

      const authorQuery = AppDataSource.getRepository(Author).createQueryBuilder('author');


      if (searchByTitle?.trim()) {
        authorQuery.andWhere(
          new Brackets(qb => {
            qb.where('author.name ILike :search', {
              search: `%${searchByTitle}%`,
            });
          }),
        );
      }

      if (sortByDate) {
        authorQuery.orderBy({
          'author.created_date':
            sortByDate === DESCENDING_ORDER_TYPE ? DESCENDING_ORDER_TYPE : ASCENDING_ORDER_TYPE,
        });
      }

      const [authors, count] = await authorQuery
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

      return [null, { data: { authors, count, pageNumber, pageSize, sortByDate, searchByTitle } }];
    } catch (error) {
      console.log('Error while fetching all author items', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAllAuthorsService;
