import models from '../models';
import ReportColumnField, { ReportColumnFields } from '../models/ReportColumnFields';
import ExcelJS from 'exceljs';
import { capitalizeWords, toUnderscore } from '../utils/namingHelper';
import { getPostgresType } from '../utils/postgresHelper';
const { Sequelize } = require('sequelize');

// Extract sequelize instance
const { sequelize } = models;

const getAvailableFieldsFromDB = async (): Promise<ReportColumnField[]> => {
    try {
        const availableFields = await ReportColumnField.findAll();
        return availableFields;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getReportData = async (data: any, flag: boolean = false): Promise<any> => {
    try {
        const columnResults: Array<{ columnName: string, data: any[] }> = [];
        const normalizedResults: Record<string, any[]> = {};

        // console.log("Data:", data);

        const fields = data.columns;
        const date = data.date;
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
                const query = `SELECT ${columnName} FROM ${sourceTable.source_table} WHERE doc_date = '${date}'`;
                const [sourceTableData] = await sequelize.query(query);

                // Store both the column name and its data
                columnResults.push({
                    columnName,
                    data: sourceTableData
                });
            }
        }

        if (flag) {
            const result = {
                fields: fields,
                data: columnResults
            }
            return result;
        }
        // Normalize the results
        for (const { columnName, data } of columnResults) {
            // console.log(`Processing column: ${columnName}`);
            // console.log('Data:', data);

            // Extract just the values for this column into an array
            normalizedResults[columnName] = data.map(item => item[columnName]);
        }

        return normalizedResults;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const exportReportData = async (data: any): Promise<any> => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        const resData = await getReportData(data, true);

        const reportData = resData.data;


        // Add headers first
        const headers = resData.fields.map((item: any) => item.label);

        worksheet.addRow(headers);
        const maxRows = Math.max(...reportData.map((item: any) => item.data.length));
        // Add data rows
        for (let i = 0; i < maxRows; i++) {
            const rowData = reportData.map((item: any) => {
                return i < item.data.length ? item.data[i][item.columnName] : '';
            });
            worksheet.addRow(rowData);
        }

        if (reportData.total) {
            worksheet.addRow(['Total', reportData.total]);
        }

        // Return buffer instead of writing to file
        return await workbook.xlsx.writeBuffer();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getTableNameDB = async (): Promise<any> => {
    const distinctSourceTables = await ReportColumnField.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('source_table')), 'source_table']
        ],
        raw: true,
    });
    return distinctSourceTables;
}


const addFieldsInDB = async (data: any, isTableCreate = false): Promise<any> => {
    try {
        console.log(isTableCreate);
        let fieldData: any = {};
        let result: any = {};



        if (isTableCreate) {

            data.columns.forEach(async (field: any) => {
                console.log(field);
                fieldData = {
                    field_key: toUnderscore(field.name),
                    source_table: data.tableName,
                    field_name: `${data.tableName}.${field.name} `,
                    name: capitalizeWords(field.name),
                    label: capitalizeWords(field.name),
                    data_type: getPostgresType(field.type),
                    is_filterable: false,
                    is_sortable: false,
                    is_groupable: false
                };
            });
        } else {
            fieldData = {
                field_key: toUnderscore(data.fieldName),
                source_table: data.sourceTable,
                field_name: `${data.sourceTable}.${toUnderscore(data.fieldName)} `,
                name: capitalizeWords(data.fieldName),
                label: capitalizeWords(data.fieldName),
                data_type: getPostgresType(data.fieldType),
                is_filterable: false,
                is_sortable: false,
                is_groupable: false
            };
        }
        console.log(fieldData);
        // Use create() for single record - this triggers the @AfterCreate hook
        result = await ReportColumnFields.create(fieldData);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export {
    getAvailableFieldsFromDB,
    getReportData,
    exportReportData,
    addFieldsInDB,
    getTableNameDB
};