import express from 'express';
import AuthController from 'src/controllers/auth.controller';

const args = { mergeParams: true };
const authRouter = express.Router(args);

authRouter.route('/login').post(AuthController.login);

export { authRouter };
