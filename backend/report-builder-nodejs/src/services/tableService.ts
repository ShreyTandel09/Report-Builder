import { Sequelize, DataTypes, QueryTypes } from 'sequelize';
import { TableSchema } from '../types/table.types';
import { getPostgresType } from '../utils/postgresHelper';
import models from '../models';

const sequelize: Sequelize = models.sequelize;

const createTableService = async (data: TableSchema): Promise<string> => {
    try {


        const { tableName, columns } = data;

        if (!tableName || !columns || !Array.isArray(columns)) {
            throw new Error('Invalid table schema');
        }

        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table schema');
        }

        const attributes: any = {};

        let hasPrimaryKey = false;

        for (const column of columns) {
            const type = getPostgresType(column);

            attributes[column.name] = {
                type: (DataTypes as any)[type] || DataTypes.STRING,
                allowNull: !column.required,
            };

            if (column.primaryKey) {
                attributes[column.name].primaryKey = true;
                hasPrimaryKey = true;
            }
        }

        if (!hasPrimaryKey) {
            attributes.id = {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            };
        }

        attributes.created_at = {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        };

        // Dynamically define and sync the model
        const dynamicModel = sequelize.define(tableName, attributes, {
            tableName,
            timestamps: false, // Disable Sequelize's createdAt/updatedAt if not needed
        });

        await dynamicModel.sync({ force: false }); // will create if not exists

        // Store table schema in metadata table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS table_schemas (
            table_name VARCHAR(255) PRIMARY KEY,
            schema_json JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

        await sequelize.query(
            `INSERT INTO table_schemas (table_name, schema_json)
         VALUES (:tableName, :schema)
         ON CONFLICT (table_name) DO UPDATE SET schema_json = EXCLUDED.schema_json`,
            {
                replacements: {
                    tableName,
                    schema: JSON.stringify({ tableName, columns }),
                },
            }
        );

        return tableName;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
};

// Insert data endpoint
const insertDataTableService = async (params: any, data: any): Promise<any> => {
    try {
        const { tableName } = params;
        const rowData = data;

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name');
        }

        // Get table schema using Sequelize
        const [schemaResults] = await sequelize.query(
            'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
            {
                replacements: { tableName },
                type: QueryTypes.SELECT
            }
        ) as any[];

        if (!schemaResults) {
            throw new Error(`Table '${tableName}' not found`);
        }

        const schema = schemaResults.schema_json;

        // Validate required fields
        for (const column of schema.columns) {
            if (column.required && !data.hasOwnProperty(column.name)) {
                throw new Error(`Required field '${column.name}' is missing`);
            }
        }

        // Build INSERT query
        const columns = Object.keys(data);
        const values = Object.values(data);

        const insertQuery = `
            INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')}) 
            VALUES (${columns.map((_, i) => `:param${i}`).join(', ')}) 
            RETURNING *
        `;

        // Create replacements object for Sequelize
        const replacements: any = {};
        values.forEach((value, i) => {
            replacements[`param${i}`] = value;
        });

        const [results] = await sequelize.query(insertQuery, {
            replacements,
            type: QueryTypes.INSERT
        });

        return results;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;

    }
};


const getTableDataService = async (params: any): Promise<any> => {
    try {
        const { tableName } = params;

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name');
        }

        // Get table schema using Sequelize
        const [schemaResults] = await sequelize.query(
            'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
            {
                replacements: { tableName },
                type: QueryTypes.SELECT
            }
        ) as any[];

        if (!schemaResults) {
            throw new Error(`Table '${tableName}' not found`);
        }

        const schema = schemaResults.schema_json;

        // Build SELECT query
        const selectQuery = `
            SELECT ${schema.columns.map((col: any) => `"${col.name}"`).join(', ')}
            FROM "${tableName}"
        `;

        const [results] = await sequelize.query(selectQuery, {
            type: QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error getting table data:', error);
        throw error;

    }
};



const updateTableDataService = async (params: any, data: any): Promise<any> => {
    try {
        const { tableName, id } = params;

        // Handle different data structures - check if updateData exists, otherwise use data directly
        const updateData = data?.updateData || data;

        // Validate inputs
        if (!updateData || typeof updateData !== 'object') {
            throw new Error('Update data is required and must be an object');
        }

        if (!tableName) {
            throw new Error('Table name is required');
        }

        if (!id) {
            throw new Error('ID is required');
        }

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name');
        }

        // Get table schema using Sequelize
        const [schemaResults] = await sequelize.query(
            'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
            {
                replacements: { tableName },
                type: QueryTypes.SELECT
            }
        ) as any[];

        if (!schemaResults) {
            throw new Error(`Table '${tableName}' not found`);
        }

        const schema = schemaResults.schema_json;

        // Validate schema exists
        if (!schema || !schema.columns) {
            throw new Error(`Invalid schema for table '${tableName}'`);
        }

        // Validate required fields
        for (const column of schema.columns) {
            if (column.required && !updateData.hasOwnProperty(column.name)) {
                throw new Error(`Required field '${column.name}' is missing`);
            }
        }

        // Get the keys and values for the update
        const columns = Object.keys(updateData);
        const values = Object.values(updateData);

        // Make sure we have data to update
        if (columns.length === 0) {
            throw new Error('No data provided for update');
        }

        // Build UPDATE query
        const updateQuery = `
            UPDATE "${tableName}"
            SET ${columns.map((col, i) => `"${col}" = :param${i}`).join(', ')}
            WHERE id = :id
            RETURNING *
        `;

        // Create replacements object for Sequelize
        const replacements: any = { id };
        values.forEach((value, i) => {
            replacements[`param${i}`] = value;
        });

        const [results] = await sequelize.query(updateQuery, {
            replacements,
            type: QueryTypes.UPDATE
        });

        return results;
    } catch (error) {
        console.error('Error updating table data:', error);
        throw error;
    }
};

const deleteTableDataService = async (params: any): Promise<any> => {
    try {
        const { tableName, id } = params;

        // Validate inputs
        if (!tableName) {
            throw new Error('Table name is required');
        }

        if (!id) {
            throw new Error('ID is required');
        }

        // Validate table name format
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name format');
        }

        // First, check if the table exists in our schema registry
        const [schemaResults] = await sequelize.query(
            'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
            {
                replacements: { tableName },
                type: QueryTypes.SELECT
            }
        ) as any[];

        if (!schemaResults) {
            throw new Error(`Table '${tableName}' not found in schema registry`);
        }

        // Check if the record exists before attempting to delete
        const [existingRecord] = await sequelize.query(
            `SELECT id FROM "${tableName}" WHERE id = :id`,
            {
                replacements: { id },
                type: QueryTypes.SELECT
            }
        ) as any[];

        if (!existingRecord) {
            throw new Error(`Record with ID '${id}' not found in table '${tableName}'`);
        }

        // First get the record that will be deleted for return purposes
        const [recordToDelete] = await sequelize.query(
            `SELECT * FROM "${tableName}" WHERE id = :id`,
            {
                replacements: { id },
                type: QueryTypes.SELECT
            }
        ) as any[];

        // Build DELETE query
        const deleteQuery = `DELETE FROM "${tableName}" WHERE id = :id`;

        // Execute the delete query
        const results = await sequelize.query(deleteQuery, {
            replacements: { id },
            type: QueryTypes.DELETE
        });

        // Check if any rows were actually deleted
        // results[1] contains the number of affected rows for DELETE operations
        const affectedRows = Array.isArray(results) ? results[1] : 0;

        if (affectedRows === 0) {
            throw new Error(`Failed to delete record with ID '${id}' from table '${tableName}'`);
        }

        return {
            success: true,
            deletedRecord: recordToDelete,
            affectedRows: affectedRows,
            message: `Successfully deleted record with ID '${id}' from table '${tableName}'`
        };

    } catch (error) {
        console.error('Error deleting table data:', error);

        // Provide more specific error information
        if (error instanceof Error) {
            throw new Error(`Delete operation failed: ${error.message}`);
        }

        throw new Error('Unknown error occurred during delete operation');
    }
};
export {
    createTableService,
    insertDataTableService,
    getTableDataService,
    updateTableDataService,
    deleteTableDataService
};
