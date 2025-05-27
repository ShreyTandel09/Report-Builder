export interface tableColumnValues {
    name: string;
    type: 'VARCHAR' | 'INTEGER' | 'BOOLEAN' | 'DATE' | 'TEXT' | 'DECIMAL';
    length?: number;
    required?: boolean;
    primaryKey?: boolean;
}

export interface tableSchemaValues {
    tableName: string;
    columns: tableColumnValues[];
}