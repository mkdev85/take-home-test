import type { Request, Response, Application } from 'express';
import apiRoutes from './api';

const initRoutes = (app: Application) => {
  app.use(apiRoutes);

  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });
};

export default initRoutes;
