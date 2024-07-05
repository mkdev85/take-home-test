import Joi from 'joi';

import { Author } from 'src/entities/authors';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, AUTHOR_NOT_FOUND, INVALID_PARAMETER } from 'src/utils/constants';
import { fieldsValidator } from 'src/utils/methodHelper';

import type { ServiceResponseReturnType } from 'src/types';

const UpdateAuthorSchema = Joi.object({
  birthDate: Joi.date().raw(),
  bio: Joi.string().trim(),
  name: Joi.string().trim(),
}).or('birthDate', 'bio', 'name');

interface IUpdateAuthorServiceParams {
  authorId: string;
  birthDate: string;
  bio: string;
  name: string;
}

class UpdateAuthorService {
  static async run({
    authorId,
    birthDate,
    bio,
    name,
  }: IUpdateAuthorServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: UpdateAuthorSchema,
        fields: { birthDate, bio, name },
      });

      if (errors) {
        return [errors];
      }

      const AuthorRepository = AppDataSource.getRepository(Author);

      // Check if author exists
      const authorData = await AuthorRepository.findOne({
        where: {
          id: authorId,
        },
      });

      if (!authorData) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: AUTHOR_NOT_FOUND,
          },
        ];
      }

      await AuthorRepository.save({
        id: authorId,
        birthDate: birthDate ?? authorData.birthdate,
        bio: bio ?? authorData.bio,
        name: name ?? authorData.name,
      });

      return [
        null,
        {
          data: { birthDate, bio, name },
          message: `Author '${name || authorData.name}' has been successfully updated!`,
        },
      ];
    } catch (error) {
      console.log('Error while updating an author', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default UpdateAuthorService;
