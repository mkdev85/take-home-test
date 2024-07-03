import Joi from 'joi';
import { ILike } from 'typeorm';

import { Author } from 'src/entities/authors';
import { AppDataSource } from 'src/utils/data-source';
import {
  INTERNAL_SERVER_ERROR,
  AUTHOR_NAME_ALREADY_EXIST,
  AUTHOR_NOT_FOUND,
  INVALID_PARAMETER,
} from 'src/utils/constants';
import type { ServiceResponseReturnType } from 'src/types';
import { fieldsValidator } from 'src/utils/methodHelper';

const UpdateAuthorSchema = Joi.object({
  birthDate: Joi.date().raw().required(),
  bio: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
});

interface IUpdateAuthorServiceParams {
  authorId: string;
  birthDate: string;
  bio: string;
  name: string
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
      const authorToUpdate = await AuthorRepository.findOne({
        where: {
          id: authorId
        },
      });

      if (!authorToUpdate) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: AUTHOR_NOT_FOUND,
          },
        ];
      }

      // Update author fields
      authorToUpdate.bio = bio;
      authorToUpdate.birthdate = birthDate;
      authorToUpdate.name = name;

      await AuthorRepository.save(authorToUpdate);

      return [
        null,
        {
          data: { birthDate, bio, name },
          message: `Author successfully updated!`,
        },
      ];
    } catch (error) {
      console.log('Error while updating an author', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default UpdateAuthorService;
