import express from 'express';
// Handle import correctly with ES modules
// @ts-ignore - ignore TypeScript error if any
import models from './models';
const { sequelize } = models;
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index';
import runAllSeeders from './seeders';
import { DynamicModelService } from './services/dynamicModelService';

const app = express();

// Create instance of DynamicModelService
const dynamicModelService = new DynamicModelService(sequelize);

//middleware 
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
// Routes
app.use('/api', routes);

if (require.main === module) {
  const PORT = process.env.PORT || 9000;

  const startServer = async () => {
    try {
      // Add more logging to debug
      console.log('Sequelize instance type:', typeof sequelize);
      console.log('Sequelize authenticate method exists:', typeof sequelize?.authenticate === 'function');

      await sequelize.authenticate();
      console.log('Database connected successfully');

      console.log('🔄 Initializing dynamic models...');
      // Call method on the instance, not the class
      await dynamicModelService.initializeAllModels();
      console.log('Model initialize successfully');

      const status = dynamicModelService.getInitializationStatus();
      console.log(`✓ Dynamic models initialized: ${status.modelCount} models loaded`);
      console.log('📋 Registered models:', status.registeredModels);

      // Run seeders if environment variable is set
      const shouldRunSeeders = process.env.RUN_SEEDERS === 'true';
      if (shouldRunSeeders) {
        try {
          await runAllSeeders(sequelize);
          console.log('Database seeding completed');
        } catch (seedError) {
          console.error('Error running seeders:', seedError);
          // Continue with server startup even if seeders fail
        }
      }

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        // console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error('Server startup failed', { error });
      process.exit(1);
    }
  };

  startServer();
}

// Export the app and the service instance for testing purposes
export default app;
export { dynamicModelService };