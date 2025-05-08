import { Sequelize } from 'sequelize-typescript';
import seedSalesData from './salesData';
import seedReportColumnFields from './reportColumnFieldsData';

/**
 * Run all seeders in the correct order
 * @param sequelize - Sequelize instance
 */
export const runAllSeeders = async (sequelize: Sequelize): Promise<void> => {
  try {
    console.log('Starting database seeding...');
    
    // Run seeders in the correct order (tables first, then related data)
    await seedSalesData(sequelize);
    await seedReportColumnFields(sequelize);
    
    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
};

export {
  seedSalesData,
  seedReportColumnFields
};

export default runAllSeeders; 