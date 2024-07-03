import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  INTERNAL_SERVER_ERROR,
} from 'src/utils/constants';

import { Author } from 'src/entities/authors';
import { Brackets } from 'typeorm';

interface IGetAllAuthorsServiceParams {
  pageNumber: number;
  pageSize: number;
  searchKeyword?: string;
  sortByName?: string;
  sortByDate?: string;
  loggedInUserId: string;
}

class GetAllAuthorsService {
  static async run(parameters: IGetAllAuthorsServiceParams): ServiceResponseReturnType {
    try {
      const {
        pageNumber,
        pageSize,
        loggedInUserId,
        searchKeyword,
        sortByDate,
        sortByName,
      } = parameters;

      const authorQuery = AppDataSource.getRepository(Author).createQueryBuilder('author');


      if (searchKeyword?.trim()) {
        authorQuery.andWhere(
          new Brackets(qb => {
            qb.where('author.name ILike :search OR author.bio ILike :search', {
              search: `%${searchKeyword}%`,
            });
          }),
        );
      }

      const [authors, count] = await authorQuery
        .take(pageSize)
        .getManyAndCount();

      return [null, { data: { authors, count, pageNumber, pageSize, sortByDate, sortByName } }];
    } catch (error) {
      console.log('Error while fetching all author items', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAllAuthorsService;
