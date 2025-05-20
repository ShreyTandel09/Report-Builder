import { Sequelize } from 'sequelize-typescript';
import SalesTable from '../models/SalesTable';

/**
 * Seeder function to populate sales_table with sample data
 * @param sequelize - Sequelize instance
 */
export const seedSalesData = async (sequelize: Sequelize): Promise<void> => {
  try {
    console.log('Seeding sales data...');
    
    // Check if table exists and is empty
    const count = await SalesTable.count();
    if (count > 0) {
      console.log('Sales data already exists. Skipping seeder.');
      return;
    }
    
    // Sample sales data
    const salesData = [
      {
        location: 'New York Store',
        location_code: 101,
        doc_no: 1001,
        doc_date: new Date('2023-01-15'),
        net_sales_qty: 1250.75
      },
      {
        location: 'Los Angeles Store',
        location_code: 102,
        doc_no: 1002,
        doc_date: new Date('2023-01-16'),
        net_sales_qty: 2100.50
      },
      {
        location: 'Chicago Store',
        location_code: 103,
        doc_no: 1003,
        doc_date: new Date('2023-01-17'),
        net_sales_qty: 950.25
      },
      {
        location: 'Houston Store',
        location_code: 104,
        doc_no: 1004,
        doc_date: new Date('2023-01-18'),
        net_sales_qty: 1800.00
      },
      {
        location: 'Phoenix Store',
        location_code: 105,
        doc_no: 1005,
        doc_date: new Date('2023-01-19'),
        net_sales_qty: 750.80
      },
      {
        location: 'Philadelphia Store',
        location_code: 106,
        doc_no: 1006,
        doc_date: new Date('2023-01-20'),
        net_sales_qty: 1350.60
      },
      {
        location: 'San Antonio Store',
        location_code: 107,
        doc_no: 1007,
        doc_date: new Date('2023-01-21'),
        net_sales_qty: 920.40
      },
      {
        location: 'San Diego Store',
        location_code: 108,
        doc_no: 1008,
        doc_date: new Date('2023-01-22'),
        net_sales_qty: 1670.90
      },
      {
        location: 'Dallas Store',
        location_code: 109,
        doc_no: 1009,
        doc_date: new Date('2023-01-23'),
        net_sales_qty: 1450.30
      },
      {
        location: 'San Jose Store',
        location_code: 110,
        doc_no: 1010,
        doc_date: new Date('2023-01-24'),
        net_sales_qty: 890.25
      }
    ];
    
    // Insert data
    await SalesTable.bulkCreate(salesData);
    
    console.log('Sales data seeded successfully!');
  } catch (error) {
    console.error('Error seeding sales data:', error);
    throw error;
  }
};

export default seedSalesData; 