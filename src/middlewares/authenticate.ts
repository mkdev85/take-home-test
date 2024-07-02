import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SESSION_EXPIRED, UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE } from '../utils/constants';
import { getAccessToken } from '../utils/methodHelper';
import { failureResponse } from '../utils/responseHandler';

import type { CustomRequest, IJWTPayload } from 'src/types';
import { JWT_SECRET_KEY } from 'src/utils/appConfig';

const Authenticate = async (request: CustomRequest, response: Response, next: NextFunction) => {
  const token = getAccessToken(request);

  if (!token) {
    failureResponse({
      errorType: UNAUTHORIZED,
      message: UNAUTHORIZED_USER_MESSAGE,
      response,
    });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as IJWTPayload;
    request.loggedInUserId = decodedToken.userId;
    next();
  } catch (error) {
    failureResponse({
      errorType: UNAUTHORIZED,
      message: SESSION_EXPIRED,
      response,
    });
  }
};

export default Authenticate;
