import express from 'express';

import authorsController from 'src/controllers/author.controller';
import Authenticate from 'src/middlewares/authenticate';

const args = { mergeParams: true };
const authorRouter = express.Router(args);

authorRouter.route('/').get(authorsController.GetAllAuthors);

authorRouter.route('/').post(Authenticate, authorsController.CreateAuthor);

authorRouter.route('/:authorId').get(authorsController.GetAuthor);

authorRouter.route('/:authorId').put(Authenticate, authorsController.UpdateAuthor);

authorRouter.route('/:authorId').delete(Authenticate, authorsController.DeleteAuthor);

export { authorRouter };
