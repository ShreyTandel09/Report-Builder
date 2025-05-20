import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

require('dotenv').config();

// Define an environment type and config type for better type safety
export type Environment = 'development' | 'test' | 'production';

export interface DatabaseConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  dialect: Dialect;
  use_env_variable?: string;
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  logging?: boolean;
}

export interface Config {
  [key: string]: DatabaseConfig;
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

// Add debug logging to see environment variables
console.log('ENV Variables:', {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  NODE_ENV: process.env.NODE_ENV
});

const config: Config = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        // Use DB_NAME as fallback for DB_DATABASE since your .env has DB_NAME
        database: process.env.DB_DATABASE || process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: (process.env.DB_DIALECT as Dialect) || ('postgres' as Dialect),
    },
    test: {
      username: 'root',
      password: '',
      database: 'report_builder_test',
      host: '127.0.0.1',
      dialect: 'mysql' as Dialect
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: (process.env.DB_DIALECT as Dialect) || ('mysql' as Dialect),
      // Additional production settings
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: false
    }
  };

export default config;