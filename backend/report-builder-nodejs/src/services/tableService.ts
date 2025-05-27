import { Sequelize, DataTypes, QueryTypes } from 'sequelize';
import { tableSchemaValues } from '../types/table.types';
import { getPostgresType } from '../utils/postgresHelper';
import models from '../models';
import { addFieldsInDB } from './reportService';
import TableSchemas from '../models/TabelSchema';
import { DynamicModelService } from './dynamicModelService';

const sequelize: Sequelize = models.sequelize;
const dynamicModelService = new DynamicModelService(sequelize);


const createTableService = async (data: tableSchemaValues): Promise<string> => {
    try {
        const { tableName, columns } = data;

        if (!tableName || !columns || !Array.isArray(columns)) {
            throw new Error('Invalid table schema');
        }

        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name format');
        }

        // Check if model already exists to avoid duplicates
        const existingModel = dynamicModelService.getModel(tableName);
        if (existingModel) {
            console.log(`Model ${tableName} already exists and is registered`);
            return tableName;
        }


        const attributes: any = {};
        let hasPrimaryKey = false;

        // Build attributes from columns
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

        // Add auto-increment ID if no primary key exists
        if (!hasPrimaryKey) {
            attributes.id = {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            };
        }

        // Add timestamp
        attributes.created_at = {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        };

        // Define and sync the dynamic model
        const dynamicModel = sequelize.define(tableName, attributes, {
            tableName,
            timestamps: false,
            modelName: tableName,
        });

        await dynamicModel.sync({ force: false });

        // Register the model in DynamicModelService
        dynamicModelService.registerModel(tableName, dynamicModel as any);

        // Store schema in table_schemas using the model

        await TableSchemas.create({
            table_name: tableName,
            schema_json: { tableName, columns }
        });

        // Alternative using raw query if upsert not available
        // await sequelize.query(
        //     `INSERT INTO table_schemas (table_name, schema_json, created_at)
        //      VALUES (:tableName, :schema, NOW())
        //      ON CONFLICT (table_name) 
        //      DO UPDATE SET 
        //         schema_json = EXCLUDED.schema_json,
        //         updated_at = NOW()`,
        //     {
        //         replacements: {
        //             tableName,
        //             schema: JSON.stringify({ tableName, columns }),
        //         },
        //     }
        // );

        // Add fields to mediator table
        await addFieldsInDB(data, true);

        return tableName;

    } catch (error) {
        console.error('Error creating table:', error);
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

        // Try to get the model first (preferred approach)
        const dynamicModel = dynamicModelService.getModel(tableName);

        if (dynamicModel) {
            // Use Sequelize model for type safety and validation
            console.log(`Using registered model for table: ${tableName}`);

            // Get schema for validation
            const [schemaResults] = await sequelize.query(
                'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
                {
                    replacements: { tableName },
                    type: QueryTypes.SELECT
                }
            ) as any[];

            if (schemaResults) {
                const schema = schemaResults.schema_json;

                // Validate required fields
                for (const column of schema.columns) {
                    if (column.required && !data.hasOwnProperty(column.name)) {
                        throw new Error(`Required field '${column.name}' is missing`);
                    }
                }
            }

            // Use the model to create the record
            const result = await dynamicModel.create(data);
            return result;
        }
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

        // Try to get the model first
        const dynamicModel = dynamicModelService.getModel(tableName);

        if (dynamicModel) {
            // Use Sequelize model for better query building
            console.log(`Using registered model for table: ${tableName}`);
            const results = await dynamicModel.findAll();
            return results;
        }
    } catch (error) {
        console.error('Error getting table data:', error);
        throw error;

    }
};



const updateTableDataService = async (params: any, data: any): Promise<any> => {
    try {
        const { tableName, id } = params;
        const updateData = data?.updateData || data;

        // Validate inputs
        if (!updateData || typeof updateData !== 'object') {
            throw new Error('Update data is required and must be an object');
        }

        if (!tableName || !id) {
            throw new Error('Table name and ID are required');
        }

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name');
        }

        // Try to get the model first
        const dynamicModel = dynamicModelService.getModel(tableName);

        if (dynamicModel) {
            // Use Sequelize model for update
            console.log(`Using registered model for table: ${tableName}`);

            const [affectedRows] = await dynamicModel.update(updateData, {
                where: { id },
                returning: true
            });

            if (affectedRows === 0) {
                throw new Error(`No record found with ID '${id}' in table '${tableName}'`);
            }

            // Return the updated record
            const updatedRecord = await dynamicModel.findByPk(id);
            return updatedRecord;
        }
    } catch (error) {
        console.error('Error updating table data:', error);
        throw error;
    }
};

const deleteTableDataService = async (params: any): Promise<any> => {
    try {
        const { tableName, id } = params;

        if (!tableName || !id) {
            throw new Error('Table name and ID are required');
        }

        // Validate table name format
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('Invalid table name format');
        }

        // Try to get the model first
        const dynamicModel = dynamicModelService.getModel(tableName);

        if (dynamicModel) {
            // Use Sequelize model for delete
            console.log(`Using registered model for table: ${tableName}`);

            // Get the record before deleting
            const recordToDelete = await dynamicModel.findByPk(id);

            if (!recordToDelete) {
                throw new Error(`Record with ID '${id}' not found in table '${tableName}'`);
            }

            // Delete the record
            const affectedRows = await dynamicModel.destroy({
                where: { id }
            });

            if (affectedRows === 0) {
                throw new Error(`Failed to delete record with ID '${id}' from table '${tableName}'`);
            }

            return {
                success: true,
                deletedRecord: recordToDelete,
                affectedRows: affectedRows,
                message: `Successfully deleted record with ID '${id}' from table '${tableName}'`
            };
        }

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
