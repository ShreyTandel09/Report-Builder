import { tableColumnValues } from "../types/table.types";

// Helper function to convert column type to PostgreSQL type
export const getPostgresType = (column: tableColumnValues): string => {
    switch (column.type) {
        case 'VARCHAR':
            return `VARCHAR(${column.length || 255})`;
        case 'INTEGER':
            return 'INTEGER';
        case 'BOOLEAN':
            return 'BOOLEAN';
        case 'DATE':
            return 'DATE';
        case 'TEXT':
            return 'TEXT';
        case 'DECIMAL':
            return 'DECIMAL(10,2)';
        default:
            return 'TEXT';
    }
};