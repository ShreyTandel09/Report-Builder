import models from '../models';
import ReportColumnField from '../models/ReportColumnFields';

// Extract sequelize instance
const { sequelize } = models;

const getAvailableFieldsFromDB = async (): Promise<ReportColumnField[]> => {
    try {        
        const availableFields = await ReportColumnField.findAll();
        return availableFields;
    } catch (error) {
        console.log(error);
        return []; 
    }
};

const getReportData = async (data: any): Promise<any> => {
    try {
        const columnResults: Array<{columnName: string, data: any[]}> = [];
        const normalizedResults: Record<string, any[]> = {};

        const fields = data.fields;
        for (const field of fields) {
            const fieldValue = field.field_name;
            const sourceTable = await ReportColumnField.findOne({
                where: {
                    field_name: fieldValue
                }
            });
            
            if (sourceTable) {
                // Extract the column name without the table prefix
                const columnName = fieldValue.includes('.') ? fieldValue.split('.')[1] : fieldValue;
                
                // Use proper table alias in the query
                const query = `SELECT ${columnName} FROM ${sourceTable.source_table}`;
                const [sourceTableData] = await sequelize.query(query);
                
                // Store both the column name and its data
                columnResults.push({
                    columnName,
                    data: sourceTableData
                });
            }
        }

        // Normalize the results
        for (const { columnName, data } of columnResults) {
            console.log(`Processing column: ${columnName}`);
            console.log('Data:', data);
            
            // Extract just the values for this column into an array
            normalizedResults[columnName] = data.map(item => item[columnName]);
        }
        
        return normalizedResults;
    } catch (error) {
        console.log(error);
        return {};
    }
}

export {
    getAvailableFieldsFromDB,
    getReportData
};