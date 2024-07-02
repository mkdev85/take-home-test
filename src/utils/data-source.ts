import '../config';

import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME } from './appConfig';

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
