// import type { Response } from 'express';

// import GetAllTodosService from 'src/services/todos/getAllTodos';
// import CreateTodoService from 'src/services/todos/createTodo';
// import UpdateTodoService from 'src/services/todos/updateTodo';
// import DeleteTodoService from 'src/services/todos/deleteTodo';

// import { sendResponse } from 'src/utils/responseHandler';

// import type { CustomRequest } from 'src/types';

// class BooksController {
//   static async GetAllBooks(request: CustomRequest, response: Response) {
//     sendResponse({
//       service: GetAllTodosService,
//       parameters: {
//         pageNumber: Number(request.query.page_number) || 1,
//         pageSize: Number(request.query.page_size) || 10,
//         searchKeyword: request.query.search_keyword,
//         sortByDate: request.query.sort_by_date,
//         sortByTitle: request.query.sort_by_title,
//         status: request.query.status,
//         loggedInUserId: request.loggedInUserId,
//       },
//       response,
//     });
//   }
// }

// export default TodosController;
