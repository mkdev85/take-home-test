import Joi from 'joi';

import { Author } from 'src/entities/authors';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, AUTHOR_NAME_ALREADY_EXIST, INVALID_PARAMETER } from 'src/utils/constants';

import type { ServiceResponseReturnType } from 'src/types';
import { fieldsValidator } from 'src/utils/methodHelper';
import { ILike } from 'typeorm';

const CreateAuthorSchema = Joi.object({
  birthDate: Joi.date().raw().required(),
  bio: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
});

interface ICreateAuthorServiceParams {
  birthDate: string;
  bio: string;
  name: string;
}

class CreateAuthorService {
  static async run({
    birthDate,
    bio,
    name,
  }: ICreateAuthorServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: CreateAuthorSchema,
        fields: { birthDate, bio, name },
      });

      if (errors) {
        return [errors];
      }

      const AuthorRepository = AppDataSource.getRepository(Author);

      const authorData = await AuthorRepository.findOne({
        where: {
          name: ILike(name)
        }
      });
      
      if (authorData && authorData.name) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: AUTHOR_NAME_ALREADY_EXIST,
          },
        ];
      }

      const author = new Author();
      author.bio = bio;
      author.birthdate = birthDate;
      author.name = name;

      await AuthorRepository.save(author);

      return [
        null,
        {
          data: { birthDate, name, bio },
          message: `Author '${author.name}' successfully created!`,
        },
      ];
    } catch (error) {
      console.log('Error while creating an author', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default CreateAuthorService;
