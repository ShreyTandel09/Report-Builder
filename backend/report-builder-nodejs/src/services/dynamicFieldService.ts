// services/DynamicFieldService.ts
import { QueryInterface, DataTypes, Sequelize, Model } from 'sequelize';

export class DynamicFieldService {
  private sequelize: Sequelize;
  private queryInterface: QueryInterface;


  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.queryInterface = sequelize.getQueryInterface();

  }



  private mapDataType(dataType: string): any {
    const typeMap: { [key: string]: any } = {
      'STRING': DataTypes.STRING,
      'INTEGER': DataTypes.INTEGER,
      'FLOAT': DataTypes.FLOAT,
      'DOUBLE': DataTypes.DOUBLE,
      'DECIMAL': DataTypes.DECIMAL,
      'BOOLEAN': DataTypes.BOOLEAN,
      'DATE': DataTypes.DATE,
      'DATEONLY': DataTypes.DATEONLY,
      'TEXT': DataTypes.TEXT,
      'BIGINT': DataTypes.BIGINT,
    };
    return typeMap[dataType.toUpperCase()] || DataTypes.STRING;
  }

  private async columnExists(tableName: string, columnName: string): Promise<boolean> {
    try {
      const tableDescription = await this.queryInterface.describeTable(tableName);
      console.log("tableDescription");
      console.log(tableDescription);

      return columnName in tableDescription;
    } catch (error) {
      return false;
    }
  }

  async addFieldToTable(tableName: string, fieldName: string, dataType: string): Promise<void> {
    try {
      // Check if column already exists
      const exists = await this.columnExists(tableName, fieldName);
      if (exists) {
        console.log(`Column '${fieldName}' already exists in table '${tableName}'`);
        return;
      }

      // Add column to database
      await this.queryInterface.addColumn(tableName, fieldName, {
        type: this.mapDataType(dataType),
        allowNull: true,
      });


      console.log(`Column '${fieldName}' added to table '${tableName}'`);
    } catch (error) {
      console.error(`Error adding column to table:`, error);
      throw error;
    }
  }

  addAttributeToModel(model: any, fieldName: string, dataType: string): void {
    try {
      // Check if attribute already exists
      if (model.rawAttributes[fieldName]) {
        console.log(`Attribute '${fieldName}' already exists in model`);
        return;
      }

      // Add the attribute to the model's rawAttributes
      model.rawAttributes[fieldName] = {
        type: this.mapDataType(dataType),
        field: fieldName,
        fieldName: fieldName,
        allowNull: true,
      };

      // Refresh the model's attributes
      model.refreshAttributes();

      console.log(`Attribute '${fieldName}' added to model`);
    } catch (error) {
      console.error(`Error adding attribute to model:`, error);
      throw error;
    }
  }
}