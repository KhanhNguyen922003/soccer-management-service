/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import 'tsconfig-paths/register';
import { config } from "dotenv";
import { join } from "path";
import { DataSource } from 'typeorm';
import entities from '@/models/entities';

config();

// Support DATABASE_URL (recommended for Neon) or individual DB_* vars
const databaseUrl = process.env.DATABASE_URL;

const isPostgres = !!databaseUrl || process.env.DB_TYPE === 'postgres' || process.env.DB_HOST;

const dataSourceOptions: any = {
  type: databaseUrl ? 'postgres' : 'postgres',
  entities: entities,
  migrationsTableName: "migrations",
  migrations: [join(__dirname, "../migrations-postgres/**/*.ts")],
  synchronize: false,
  logging: true,
};

if (databaseUrl) {
  dataSourceOptions.url = databaseUrl;
} else {
  // fallback to individual env vars (Postgres)
  dataSourceOptions.host = process.env.DB_HOST;
  dataSourceOptions.port = parseInt(process.env.DB_PORT || '5432');
  dataSourceOptions.username = process.env.DB_USERNAME;
  dataSourceOptions.password = process.env.DB_PASSWORD;
  dataSourceOptions.database = process.env.DB_DATABASE;
}

export default new DataSource(dataSourceOptions);

