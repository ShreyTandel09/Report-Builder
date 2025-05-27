import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'table_schemas',
    timestamps: false,
})
export class TableSchemas extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    table_name!: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    schema_json!: object;

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
}

export default TableSchemas;
