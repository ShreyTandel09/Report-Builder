export interface TableColumn {
    name: string;
    type: 'VARCHAR' | 'INTEGER' | 'BOOLEAN' | 'DATE' | 'TEXT' | 'DECIMAL';
    length?: number;
    required?: boolean;
    primaryKey?: boolean;
}

export interface TableSchema {
    tableName: string;
    columns: TableColumn[];
}