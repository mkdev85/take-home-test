import type { Request, Response } from 'express';

import LoginUserService from 'src/services/auth/login';

import { sendResponse } from 'src/utils/responseHandler';

class AuthController {
  static async login(request: Request, response: Response) {
    sendResponse({
      service: LoginUserService,
      parameters: {
        email: request.body.email,
        password: request.body.password,
      },
      response,
    });
  }
}

export default AuthController;
