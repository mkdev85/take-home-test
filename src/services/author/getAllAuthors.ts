import Joi from 'src/utils/joiDate';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  ASCENDING_ORDER_TYPE,
  DESCENDING_ORDER_TYPE,
  INTERNAL_SERVER_ERROR,
} from 'src/utils/constants';

import { Author } from 'src/entities/authors';
import { Brackets } from 'typeorm';
import { fieldsValidator } from 'src/utils/methodHelper';

const GetAllAuthorsServiceSchema = Joi.object({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(5),
  searchByName: Joi.string().trim(),
  sortByDate: Joi.string().trim(),
});

interface IGetAllAuthorsServiceParams {
  pageNumber: number;
  pageSize: number;
  searchByName?: string;
  sortByDate?: string;
}

class GetAllAuthorsService {
  static async run(parameters: IGetAllAuthorsServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: GetAllAuthorsServiceSchema,
        fields: parameters,
      });

      if (errors) {
        return [errors];
      }

      const { pageNumber, pageSize, searchByName, sortByDate } = parameters;

      const authorQuery = AppDataSource.getRepository(Author).createQueryBuilder('author');

      if (searchByName?.trim()) {
        authorQuery.andWhere(
          new Brackets(qb => {
            qb.where('author.name ILike :search', {
              search: `%${searchByName}%`,
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

      return [null, { data: { authors, count, pageNumber, pageSize, sortByDate, searchByName } }];
    } catch (error) {
      console.log('Error while fetching all author items', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAllAuthorsService;
