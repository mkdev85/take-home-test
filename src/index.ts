import './config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import initRoutes from './routes';

import { AppDataSource } from './utils/data-source';
import CreateUser from './seeder/createUser';

const app = express();
const PORT = process.env.APP_PORT;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`App starting at PORT ${PORT}`);
  });
};

const setupMiddlewares = () => {
  // CORS middleware
  app.use(cors());

  // Enable logger (morgan)
  app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));

  // Request body parsing middleware
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
};

const startDatabase = async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log('Error while connecting the database', error);
    process.exit(0);
  }
};

const startApp = async () => {
  // Start Database
  await startDatabase();

  // Add Default user in database
  await CreateUser();

  // Start Server
  startServer();

  // Setup Global middleware
  setupMiddlewares();

  // Initialize routes
  initRoutes(app);
};

startApp();
