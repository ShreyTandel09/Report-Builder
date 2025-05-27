import { QueryInterface, DataTypes, Sequelize, QueryTypes, } from 'sequelize';
import { ModelCtor, Model } from 'sequelize-typescript';

export class DynamicModelService {
    private sequelize: Sequelize;
    private queryInterface: QueryInterface;
    private models: Map<string, ModelCtor<Model>>;
    private isInitialized: boolean = false;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.queryInterface = sequelize.getQueryInterface();
        this.models = new Map();
    }

    // Initialize all models from schema during server startup
    async initializeAllModels(): Promise<void> {
        if (this.isInitialized) {
            console.log('Models already initialized, skipping...');
            return;
        }

        try {
            console.log('Initializing all models from schema...');

            // Fetch all table schemas from database
            const schemas = await this.sequelize.query(
                'SELECT table_name, schema_json FROM table_schemas',
                {
                    type: QueryTypes.SELECT
                }
            ) as any[];

            if (!schemas || schemas.length === 0) {
                console.warn('No table schemas found in database');
                this.isInitialized = true;
                return;
            }

            console.log(`Found ${schemas.length} table schemas to initialize`);

            // Initialize models in parallel for better performance
            const initPromises = schemas.map(async (schemaRow) => {
                const { table_name, schema_json } = schemaRow;
                try {
                    const model = await this.recreateModelFromSchemaData(table_name, schema_json);
                    if (model) {
                        console.log(`✓ Model initialized: ${table_name}`);
                        return { tableName: table_name, success: true };
                    } else {
                        console.warn(`⚠ Failed to initialize model: ${table_name}`);
                        return { tableName: table_name, success: false };
                    }
                } catch (error) {
                    console.error(`✗ Error initializing model ${table_name}:`, error);
                    return { tableName: table_name, success: false, error };
                }
            });

            const results = await Promise.allSettled(initPromises);

            // Log summary
            const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
            const failed = results.length - successful;

            console.log(`Model initialization complete: ${successful} successful, ${failed} failed`);

            if (failed > 0) {
                const failedTables = results
                    .filter(r => r.status === 'fulfilled' && !r.value.success)
                    .map(r => r.status === 'fulfilled' ? r.value.tableName : 'unknown');
                console.warn('Failed to initialize tables:', failedTables);
            }

            this.isInitialized = true;

        } catch (error) {
            console.error('Critical error during model initialization:', error);
            throw error;
        }
    }

    // Helper method to recreate model from schema data (extracted for reusability)
    private async recreateModelFromSchemaData(tableName: string, schemaJson: any): Promise<ModelCtor<Model> | undefined> {
        try {
            const { columns } = schemaJson;
            const attributes: any = {};
            let hasPrimaryKey = false;

            // Build attributes
            for (const column of columns) {
                attributes[column.name] = {
                    type: this.mapDataType(column.type || 'STRING'), // Better type mapping
                    allowNull: !column.required,
                };
                if (column.primaryKey) {
                    attributes[column.name].primaryKey = true;
                    hasPrimaryKey = true;
                }
            }

            // Add ID if no primary key
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

            // Define model
            const model = this.sequelize.define(tableName, attributes, {
                tableName,
                timestamps: false,
                modelName: tableName,
            });

            // Register it
            this.registerModel(tableName, model as any);
            return model as any;

        } catch (error) {
            console.error(`Error recreating model ${tableName}:`, error);
            return undefined;
        }
    }

    // Improved data type mapping
    private mapDataType(type: string): any {
        const typeUpper = type.toUpperCase();
        switch (typeUpper) {
            case 'STRING':
            case 'VARCHAR':
            case 'TEXT':
                return DataTypes.STRING;
            case 'INTEGER':
            case 'INT':
                return DataTypes.INTEGER;
            case 'BIGINT':
                return DataTypes.BIGINT;
            case 'FLOAT':
                return DataTypes.FLOAT;
            case 'DOUBLE':
                return DataTypes.DOUBLE;
            case 'DECIMAL':
                return DataTypes.DECIMAL;
            case 'BOOLEAN':
            case 'BOOL':
                return DataTypes.BOOLEAN;
            case 'DATE':
                return DataTypes.DATE;
            case 'DATETIME':
                return DataTypes.DATE;
            case 'JSON':
                return DataTypes.JSON;
            case 'JSONB':
                return DataTypes.JSONB;
            default:
                return DataTypes.STRING; // Default fallback
        }
    }

    // Original method - now calls the extracted helper
    async recreateModelFromSchema(tableName: string): Promise<ModelCtor<Model> | undefined> {
        try {
            // Fetch schema from database
            const [result] = await this.sequelize.query(
                'SELECT schema_json FROM table_schemas WHERE table_name = :tableName',
                {
                    replacements: { tableName },
                    type: QueryTypes.SELECT
                }
            ) as any[];

            if (!result) return undefined;

            return await this.recreateModelFromSchemaData(tableName, result.schema_json);

        } catch (error) {
            console.error(`Error recreating model ${tableName}:`, error);
            return undefined;
        }
    }

    // Force re-initialization (useful for development/testing)
    async forceReinitialize(): Promise<void> {
        console.log('Forcing model re-initialization...');
        this.isInitialized = false;
        this.models.clear();
        await this.initializeAllModels();
    }

    // Check if service is initialized
    isReady(): boolean {
        return this.isInitialized;
    }

    // Get initialization status with details
    getInitializationStatus(): { initialized: boolean; modelCount: number; registeredModels: string[] } {
        return {
            initialized: this.isInitialized,
            modelCount: this.models.size,
            registeredModels: Array.from(this.models.keys())
        };
    }

    // Register model manually
    registerModel(tableName: string, model: ModelCtor<Model>): void {
        this.models.set(tableName, model);
    }

    // Register multiple models
    registerModels(modelMap: Record<string, ModelCtor<Model>>): void {
        Object.entries(modelMap).forEach(([tableName, model]) => {
            this.registerModel(tableName, model);
        });
    }

    // Auto-discover model from sequelize instance
    discoverModel(tableName: string): ModelCtor<Model> | undefined {
        try {
            // Check sequelize.models for a matching model
            const sequelizeModels = this.sequelize.models;

            // First, try direct table name match
            const directMatch = Object.values(sequelizeModels).find(
                (model: any) => model.tableName === tableName
            );

            if (directMatch) {
                // Auto-register for future use
                this.registerModel(tableName, directMatch as ModelCtor<Model>);
                return directMatch as ModelCtor<Model>;
            }

            console.warn(`Model not found for table: ${tableName}`);
            return undefined;
        } catch (error) {
            console.error(`Error discovering model for table ${tableName}:`, error);
            return undefined;
        }
    }

    getModel(tableName: string): ModelCtor<Model> | undefined {
        let model = this.models.get(tableName);

        // If not found, try auto-discovery
        if (!model) {
            model = this.discoverModel(tableName);
        }

        return model;
    }

    listAvailableModels(): string[] {
        return Object.keys(this.sequelize.models);
    }

    // Debug method to see registered models
    listRegisteredModels(): string[] {
        return Array.from(this.models.keys());
    }
}