import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'sales_table',
  timestamps: true,
})
export class SalesTable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  location!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  location_code!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  doc_no!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  doc_date!: Date;

  @Column({
    type: DataType.FLOAT, 
    allowNull: false,
  })
  net_sales_qty!: number;
}

export default SalesTable;
