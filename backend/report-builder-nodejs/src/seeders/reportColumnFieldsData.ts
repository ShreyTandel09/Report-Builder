import { Sequelize } from 'sequelize-typescript';
import ReportColumnFields from '../models/ReportColumnFields';

/**
 * Seeder function to populate report_column_fields with sample data
 * @param sequelize - Sequelize instance
 */
export const seedReportColumnFields = async (sequelize: Sequelize): Promise<void> => {
  try {
    console.log('Seeding report column fields data...');
    
    // Check if table exists and is empty
    const count = await ReportColumnFields.count();
    if (count > 0) {
      console.log('Report column fields data already exists. Skipping seeder.');
      return;
    }
    
    // Sample report column fields data that maps to sales_table
    const reportColumnFieldsData = [
      {
        field_key: 'location',
        source_table: 'sales_table',
        field_name: 'sales.location',
        name: 'Store Location',
        label: 'Store Location',
        data_type: 'string',
        is_filterable: true,
        is_sortable: true,
        is_groupable: true,
        aggregation_type: null
      },
      {
        field_key: 'location_code',
        source_table: 'sales_table',
        field_name: 'sales.location_code',
        name: 'Location Code',
        label: 'Location Code',
        data_type: 'integer',
        is_filterable: true,
        is_sortable: true,
        is_groupable: true,
        aggregation_type: null
      },
      {
        field_key: 'doc_no',
        source_table: 'sales_table',
        field_name: 'sales.doc_no',
        name: 'Document No',
        label: 'Document Number',
        data_type: 'integer',
        is_filterable: true,
        is_sortable: true,
        is_groupable: false,
        aggregation_type: null
      },
      {
        field_key: 'doc_date',
        source_table: 'sales_table',
        field_name: 'sales.doc_date',
        name: 'Document Date',
        label: 'Document Date',
        data_type: 'date',
        is_filterable: true,
        is_sortable: true,
        is_groupable: true,
        aggregation_type: null
      },
      {
        field_key: 'net_sales_qty',
        source_table: 'sales_table',
        field_name: 'sales.net_sales_qty',
        name: 'Net Sales Quantity',
        label: 'Net Sales Qty',
        data_type: 'decimal',
        is_filterable: true,
        is_sortable: true,
        is_groupable: false,
        aggregation_type: 'SUM'
      },
      {
        field_key: 'net_sales_qty_avg',
        source_table: 'sales_table',
        field_name: 'sales.net_sales_qty',
        name: 'Average Sales',
        label: 'Average Sales',
        data_type: 'decimal',
        is_filterable: true,
        is_sortable: true,
        is_groupable: false,
        aggregation_type: 'AVG'
      },
      {
        field_key: 'sales_count',
        source_table: 'sales_table',
        field_name: 'sales.id',
        name: 'Sales Count',
        label: 'Number of Sales',
        data_type: 'integer',
        is_filterable: true,
        is_sortable: true,
        is_groupable: false,
        aggregation_type: 'COUNT'
      }
    ];
    
    // Insert data
    await ReportColumnFields.bulkCreate(reportColumnFieldsData);
    
    console.log('Report column fields data seeded successfully!');
  } catch (error) {
    console.error('Error seeding report column fields data:', error);
    throw error;
  }
};

export default seedReportColumnFields; 