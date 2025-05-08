import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'report_column_fields',
  timestamps: true,
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
}

export default ReportColumnFields;
