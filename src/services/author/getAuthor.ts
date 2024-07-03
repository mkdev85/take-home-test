import Joi from 'joi';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_AUTHOR_ID
} from 'src/utils/constants';
import { Author } from 'src/entities/authors';
import { fieldsValidator } from 'src/utils/methodHelper';


const GetAuthorSchema = Joi.object({
  authorId: Joi.string().guid().message(INVALID_AUTHOR_ID),
});

interface IGetAuthorServiceParams {
  authorId: string;
}

class GetAuthorService {
  static async run({ authorId }: IGetAuthorServiceParams) : ServiceResponseReturnType {
    try {

      // Validating parameters
      const errors = fieldsValidator({
        schema: GetAuthorSchema,
        fields: { authorId },
      });

      if (errors) {
        return [errors];
      }

      const authorRepository = AppDataSource.getRepository(Author);

      // Fetch the author
      const author = await authorRepository.findOne({
        where: { id: authorId},
      });

      if (!author) {
        return [{ errorType: INTERNAL_SERVER_ERROR, message: 'Author not found' }];
      }

      return [null, { data: author }];
    } catch (error) {
      console.log('Error while fetching the author', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetAuthorService;
