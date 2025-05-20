'use strict';

import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import config from '../config/config';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

const db: any = {};

// Initialize Sequelize
const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable as string] as string, dbConfig)
  : new Sequelize(
      dbConfig.database as string,
      dbConfig.username as string,
      dbConfig.password as string,
      dbConfig
    );

// Function to load models (synchronous approach)
function loadModels() {
  const modelsPath = __dirname;
  const modelFiles = fs
    .readdirSync(modelsPath)
    .filter(
      (file) =>
        file !== 'index.ts' &&
        file !== 'index.js' &&
        (file.endsWith('.ts') || file.endsWith('.js'))
    );

  // Create array to store model classes
  const modelClasses: any[] = [];

  // Synchronously require each model file
  modelFiles.forEach((file) => {
    // For CommonJS require (works with both .js and .ts files when processed by ts-node)
    const modelModule = require(path.join(modelsPath, file));
    
    // Check various ways modules could export their model class
    if (modelModule.default) {
      // ES module default export
      modelClasses.push(modelModule.default);
    } else {
      // Look through all exports to find model classes
      Object.keys(modelModule).forEach((key) => {
        const exportedItem = modelModule[key];
        // Add any exported class that might be a model
        if (exportedItem && typeof exportedItem === 'function' && exportedItem.prototype) {
          modelClasses.push(exportedItem);
        }
      });
    }
  });

  return modelClasses;
}

// Load models synchronously
const loadedModels = loadModels();

// Register all loaded models with Sequelize
sequelize.addModels(loadedModels);

// Set up db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add models to db object by name
loadedModels.forEach((modelClass) => {
  if (modelClass.name) {
    db[modelClass.name] = modelClass;
  }
});

export default db;
