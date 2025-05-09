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
        // console.log(data.columns);
        const reqData = data.columns;
        const results: Record<string, any> = {};

        for (const item of reqData) {
            const field = item.field_name;
            // console.log(field);
            const sourceTable = await ReportColumnField.findOne({
                where: {
                    field_name: field
                }
            });
            
            if (sourceTable) {
                // Extract the column name without the table prefix
                const columnName = field.includes('.') ? field.split('.')[1] : field;
                
                // Use proper table alias in the query
                const query = `SELECT ${columnName} FROM ${sourceTable.source_table}`;
                const [sourceTableData] = await sequelize.query(query);
                // console.log('Query result:', sourceTableData);
                
                results[field] = sourceTableData;
            }
        }
        
        // console.log('Final results:', results);
        return results; 
    } catch (error) {
        console.log(error);
        return {};
    }
}

export {
    getAvailableFieldsFromDB,
    getReportData
};