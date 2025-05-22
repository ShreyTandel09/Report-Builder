import { QueryInterface, DataTypes, Sequelize, } from 'sequelize';
import { ModelCtor, Model } from 'sequelize-typescript';


export class DynamicModelService {
    private sequelize: Sequelize;
    private queryInterface: QueryInterface;
    private models: Map<string, ModelCtor<Model>>;



    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.queryInterface = sequelize.getQueryInterface();
        this.models = new Map();
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

            // Generate potential model names from table name
            // const potentialNames = this.generateModelNames(tableName);

            // for (const modelName of potentialNames) {
            //     if (sequelizeModels[modelName]) {
            //         const foundModel = sequelizeModels[modelName] as ModelCtor<Model>;
            //         // Auto-register for future use
            //         this.registerModel(tableName, foundModel);
            //         return foundModel;
            //     }
            // }

            console.warn(`Model not found for table: ${tableName}`);
            return undefined;
        } catch (error) {
            console.error(`Error discovering model for table ${tableName}:`, error);
            return undefined;
        }
    }

    private generateModelNames(tableName: string): string[] {
        const names: string[] = [];

        // Convert snake_case to PascalCase (sales_table -> SalesTable)
        const pascalCase = tableName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        names.push(pascalCase);

        // Add variations
        if (pascalCase.endsWith('Table')) {
            const withoutTable = pascalCase.slice(0, -5);
            names.push(withoutTable);
        } else {
            names.push(pascalCase + 'Table');
        }

        // Add original and case variations
        names.push(tableName);
        names.push(tableName.toUpperCase());

        return [...new Set(names)]; // Remove duplicates
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
