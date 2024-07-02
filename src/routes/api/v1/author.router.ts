import express from 'express';

import authorsController from 'src/controllers/author.controller';

const args = { mergeParams: true };
const authorRouter = express.Router(args);

authorRouter.route('/').post(authorsController.CreateAuthor);

export { authorRouter };
