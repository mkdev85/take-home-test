import type { Response } from 'express';

import CreateAuthorService from 'src/services/author/createAuthor';
import DeleteAuthorService from 'src/services/author/deleteAuthor';
import GetAllAuthorsService from 'src/services/author/getAllAuthors';
import GetAuthorService from 'src/services/author/getAuthor';
import UpdateAuthorService from 'src/services/author/updateAuthor';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';

class AuthorsController {
  static async GetAllAuthors(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetAllAuthorsService,
      parameters: {},
      response,
    });
  }

  static async GetAuthor(request: CustomRequest, response: Response) {
    sendResponse({
      service: GetAuthorService,
      parameters: {},
      response,
    });
  }

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

  static async UpdateAuthor(request: CustomRequest, response: Response) {
    sendResponse({
      service: UpdateAuthorService,
      parameters: {
        name: request.body.name,
        bio: request.body.bio,
        birthDate: request.body.birthDate,
      },
      response,
    });
  }
}

export default AuthorsController;
