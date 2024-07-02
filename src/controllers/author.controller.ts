import type { Response } from 'express';

import CreateAuthorService from 'src/services/author/createAuthor';
import DeleteAuthorService from 'src/services/author/deleteAuthor';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';

class TodosController {
  static async CreateAuthor(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateAuthorService,
      parameters: {
        name: request.body.name,
        bio: request.body.bio,
        birthDate: request.body.birthDate,
      },
      response,
    });
  }

  static async DeleteAuthor(request: CustomRequest, response: Response) {
    sendResponse({
      service: DeleteAuthorService,
      parameters: {
        authorId: request.params.authorId,
      },
      response,
    });
  }
}

export default TodosController;
