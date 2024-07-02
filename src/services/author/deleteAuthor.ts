import Joi from 'joi';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_AUTHOR_ID, UNAUTHORIZED } from 'src/utils/constants';

import type { ServiceResponseReturnType } from 'src/types';
import { Author } from 'src/entities/authors';
import { fieldsValidator } from 'src/utils/methodHelper';

const DeleteAuthorSchema = Joi.object({
  authorId: Joi.string().guid().message(INVALID_AUTHOR_ID),
});

interface IDeleteTodoServiceParams {
  authorId: string;
}

class DeleteAuthorService {
  static async run({ authorId }: IDeleteTodoServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: DeleteAuthorSchema,
        fields: { authorId },
      });

      if (errors) {
        return [errors];
      }

      const AuthorRepository = AppDataSource.getRepository(Author);

      const authorData = await AuthorRepository.findOneBy({
        id: authorId,
      });

      if (!authorData) {
        return [
          {
            errorType: UNAUTHORIZED,
            message: INVALID_AUTHOR_ID,
          },
        ];
      }

      await AuthorRepository.delete({ id: authorId });

      return [null, { message: `Author record '${authorData.name}' successfully deleted!` }];
    } catch (error) {
      console.log('Error while deleting an author', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default DeleteAuthorService;
