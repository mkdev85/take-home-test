import type { Response } from 'express';

import {
  INVALID_PARAMETER,
  INTERNAL_SERVER_ERROR,
  BAD_DATA,
  UNAUTHORIZED,
  NOT_FOUND,
} from './constants';
import type { IFieldsErrors, ServiceResponseReturnType } from 'src/types';

interface IResponse {
  response: Response;
  errorType?: string;
  message?: string;
  data?: any;
  fieldsErrors?: IFieldsErrors[] | null;
  code?: number;
}

interface IService {
  run: (parameters: any) => ServiceResponseReturnType;
}

interface IResponseParams {
  service: IService;
  parameters: any;
  response: Response;
}

export const successResponse = ({ response, message, data }: IResponse) => {
  response.status(200).send({
    message: message ?? 'Request has been successfully executed',
    data: data ?? [],
  });
};

export const failureResponse = ({
  response,
  message,
  code = 400,
  errorType,
  fieldsErrors = null,
}: IResponse) => {
  if (errorType === INVALID_PARAMETER) {
    code = 422;
  } else if (errorType === INTERNAL_SERVER_ERROR) {
    code = 500;
  } else if (errorType === BAD_DATA) {
    code = 400;
  } else if (errorType === UNAUTHORIZED) {
    code = 401;
  } else if (errorType === NOT_FOUND) {
    code = 404;
  }

  response.status(code).send({
    error: true,
    message: message ?? 'Error occuring while performing this request',
    fieldsErrors,
  });
};

export const sendResponse = async ({ service, parameters, response }: IResponseParams) => {
  const [errorObj, successObj] = await service.run(parameters);

  if (errorObj) {
    failureResponse({ ...errorObj, response });
  } else {
    successResponse({ ...successObj, response });
  }
};
