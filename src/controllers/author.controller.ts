import type { Response } from 'express';

import CreateAuthorService from 'src/services/author/createAuthor';

import { sendResponse } from 'src/utils/responseHandler';

import type { CustomRequest } from 'src/types';

class TodosController {
  static async CreateAuthor(request: CustomRequest, response: Response) {
    sendResponse({
      service: CreateAuthorService,
      parameters: {
        name: request.body.name,
        bio: request.body.bio,
        birthDate: request.body.birthDate
      },
      response,
    });
  }

  // static async UpdateTodo(request: CustomRequest, response: Response) {
  //   sendResponse({
  //     service: UpdateTodoService,
  //     parameters: {
  //       status: request.body.status,
  //       description: request.body.description,
  //       title: request.body.title,
  //       todoId: request.params.todoId,
  //       userId: request.loggedInUserId,
  //     },
  //     response,
  //   });
  // }

  // static async DeleteTodo(request: CustomRequest, response: Response) {
  //   sendResponse({
  //     service: DeleteTodoService,
  //     parameters: {
  //       todoId: request.params.todoId,
  //       userId: request.loggedInUserId,
  //     },
  //     response,
  //   });
  // }
}

export default TodosController;
