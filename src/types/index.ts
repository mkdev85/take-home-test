import type { Request } from 'express';
import type { Schema } from 'joi';

export interface IFieldsErrors {
  message: string;
  fieldName: string | number | undefined;
}

interface IResponse {
  errorType?: string;
  fieldsErrors?: IFieldsErrors[];
  message?: string;
}

interface IError extends IResponse {}

interface ISuccess extends IResponse {
  data?: any;
}

export type ServiceResponseReturnType = Promise<[IError | null, (ISuccess | null)?]>;

export interface CustomRequest extends Request {
  loggedInUserId?: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IFieldsValidatorParams {
  schema: Schema;
  fields: any;
}
