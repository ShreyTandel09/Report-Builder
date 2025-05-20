import models from '../models';
import runAllSeeders from '../seeders';

const { sequelize } = models;

/**
 * Script to run all seeders
 */
const runSeeders = async () => {
  try {
    console.log('Starting database connection...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Running all seeders...');
    await runAllSeeders(sequelize);
    console.log('All seeds completed successfully!');

    // Close the connection when done
    await sequelize.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

// Run the function directly when script is executed
runSeeders(); 