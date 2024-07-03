import express from 'express';

import authorsController from 'src/controllers/author.controller';

const args = { mergeParams: true };
const authorRouter = express.Router(args);

authorRouter.route('/').get(authorsController.GetAllAuthors);

authorRouter.route('/').post(authorsController.CreateAuthor);

authorRouter.route('/:authorId').get(authorsController.GetAuthor);

authorRouter.route('/:authorId').put(authorsController.UpdateAuthor);

authorRouter.route('/:authorId').delete(authorsController.DeleteAuthor);

export { authorRouter };
