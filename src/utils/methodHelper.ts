import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import type { IFieldsValidatorParams, IJWTPayload } from 'src/types';
import { INVALID_PARAMETER, INVALID_PARAMETER_MSG } from './constants';
import { JWT_SECRET_KEY } from './appConfig';
import moment from 'moment';

export const getAccessToken = (req: Request): string | undefined => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  return token;
};

export const getJWTToken = (payLoad: IJWTPayload): string => {
  return jwt.sign(payLoad, JWT_SECRET_KEY, { expiresIn: '7d' });
};

export const fieldsValidator = ({ schema, fields }: IFieldsValidatorParams) => {
  const { error } = schema.validate(fields, { abortEarly: false });
  if (error?.details?.length) {
    return {
      errorType: INVALID_PARAMETER,
      fieldsErrors: error?.details.map(({ path, message }) => ({ fieldName: path.at(0), message })),
      message: INVALID_PARAMETER_MSG,
    };
  }
};

export const isBorrowDateValid = (borrowDate: string) => {
  return moment(borrowDate, 'YYYY-MM-DD').isBetween(
    moment().startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  );
};

export const isReturnDateValid = (returnDate: string) => {
  return moment(returnDate, 'YYYY-MM-DD').isAfter(moment());
};
