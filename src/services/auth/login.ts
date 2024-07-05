import Joi from 'joi';
import { compare } from 'bcrypt';

import { AppDataSource } from 'src/utils/data-source';
import { fieldsValidator, getJWTToken } from 'src/utils/methodHelper';

import {
  EMAIL_PASSWORD_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  INVALID_EMAIL,
  NOT_FOUND,
} from '../../utils/constants';

import { User } from 'src/entities/users';
import type { ServiceResponseReturnType } from 'src/types';

const LoginSchema = Joi.object({
  email: Joi.string().email().message(INVALID_EMAIL).required(),
  password: Joi.string().trim().required(),
});

interface ILoginUserServiceParams {
  email: string;
  password: string;
}

class LoginUserService {
  static async run({ email, password }: ILoginUserServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: LoginSchema,
        fields: { email, password },
      });

      if (errors) {
        return [errors];
      }

      const userRepository = AppDataSource.getRepository(User);

      const userData = await userRepository.findOneBy({
        email: email.trim(),
      });

      if (!userData) {
        return [
          {
            errorType: NOT_FOUND,
            message: EMAIL_PASSWORD_NOT_FOUND,
          },
        ];
      }

      const isPasswordMatched = await compare(password, userData.password);

      if (!isPasswordMatched) {
        return [
          {
            errorType: NOT_FOUND,
            message: EMAIL_PASSWORD_NOT_FOUND,
          },
        ];
      }

      return [
        null,
        {
          data: {
            access_token: getJWTToken({
              userId: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
            }),
          },
        },
      ];
    } catch (error) {
      console.log('Error while executing LoginUserService', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default LoginUserService;
