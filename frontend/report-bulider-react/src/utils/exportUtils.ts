import { exportReportDataExcel } from "../service/api/reportBuilderService";
import { Column } from "../types";
import { Field } from "../types";

export const exportToCSV = async (date: string, fields: any, filename: any) => {
    try {
        const columns = convertFieldsToColumns(fields);
        
        // Make the API call with responseType: 'blob' to handle binary data
        const response = await exportReportDataExcel({
            columns: columns,
            date: date
        }, 'blob');
        
        // Create a blob from the response data
        const blob = new Blob([response.data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.xlsx`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw error;
    }
};

const convertFieldsToColumns = (fields: Field[]): Column[] => {
    return fields.map(field => ({
        field_name: field.field_name || '',
        label: field.label || ''
    }));
};

// export const exportToPDF = (data, fields, filename) => {
//     try {
//         // This is a simplified example. In a real application, you'd use a proper PDF library
//         // like jsPDF, pdfmake, or react-pdf
//         alert('PDF export would be implemented here with a PDF library like jsPDF');

//         // Implementation with jsPDF would look something like:
//         /*
//         import jsPDF from 'jspdf';
//         import 'jspdf-autotable';
        
//         const doc = new jsPDF();
        
//         const fieldNames = fields.map(field => field.name);
        
//         // Format data for autotable
//         const tableData = data.map(row => 
//           fieldNames.map(fieldName => row[fieldName])
//         );
        
//         doc.autoTable({
//           head: [fieldNames],
//           body: tableData,
//         });
        
//         doc.save(`${filename}.pdf`);
//         */
//     } catch (error) {
//         console.error('Error exporting to PDF:', error);
//         throw error;
//     }
// }; 