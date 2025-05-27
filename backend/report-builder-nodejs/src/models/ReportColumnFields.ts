import { Table, Column, Model, DataType, BeforeCreate, AfterCreate } from 'sequelize-typescript';
import { DynamicFieldService } from '../services/dynamicFieldService';
import SalesTable from './SalesTable';
import { DynamicModelService } from '../services/dynamicModelService';

@Table({
  tableName: 'report_column_fields',
  timestamps: false,
})
export class ReportColumnFields extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  field_key!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source_table!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  field_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  label!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  data_type!: string;

  // Optional: usability flags
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_filterable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_sortable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_groupable!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  aggregation_type?: string; // e.g. "SUM", "COUNT"

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at!: Date;

  @AfterCreate
  static async addDynamicField(instance: ReportColumnFields) {
    // console.log("Instance>>>");
    // console.log(instance);
    if (instance.source_table) {
      try {
        const sequelize = instance.sequelize;
        if (!sequelize) {
          throw new Error('Sequelize instance not found');
        }

        const dynamicFieldService = new DynamicFieldService(sequelize);
        const dynamicModelService = new DynamicModelService(sequelize);

        console.log('Available models in sequelize:', dynamicModelService.listAvailableModels());
        console.log('Registered models:', dynamicModelService.listRegisteredModels());

        const model = dynamicModelService.getModel(instance.source_table);
        console.log("------------------------")

        console.log(model)

        // Add column to database table
        await dynamicFieldService.addFieldToTable(
          instance.source_table,
          instance.field_key,
          instance.data_type
        );

        // Add attribute to Sequelize model
        dynamicFieldService.addAttributeToModel(
          model,
          instance.field_key,
          instance.data_type
        );

        console.log(`Dynamic field '${instance.field_name}' added successfully`);
      } catch (error) {
        console.error(`Error adding dynamic field '${instance.field_name}':`, error);
        // You might want to delete the record if field addition fails
        // await instance.destroy();
        throw error;
      }
    }
  }
}
export default ReportColumnFields;
