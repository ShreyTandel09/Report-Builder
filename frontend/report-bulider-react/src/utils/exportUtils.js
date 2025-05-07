export const exportToCSV = (data, fields, filename) => {
    try {
        // Only include the selected fields in the export
        const fieldNames = fields.map(field => field.name);

        // Create CSV headers
        const headers = fieldNames.join(',');

        // Create CSV rows
        const csvRows = data.map(row => {
            return fieldNames.map(fieldName => {
                // Handle special characters and quotes for CSV format
                const value = row[fieldName];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string') {
                    // Escape quotes and wrap in quotes
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        // Combine headers and rows
        const csvContent = [headers, ...csvRows].join('\n');

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        throw error;
    }
};

export const exportToPDF = (data, fields, filename) => {
    try {
        // This is a simplified example. In a real application, you'd use a proper PDF library
        // like jsPDF, pdfmake, or react-pdf
        alert('PDF export would be implemented here with a PDF library like jsPDF');

        // Implementation with jsPDF would look something like:
        /*
        import jsPDF from 'jspdf';
        import 'jspdf-autotable';
        
        const doc = new jsPDF();
        
        const fieldNames = fields.map(field => field.name);
        
        // Format data for autotable
        const tableData = data.map(row => 
          fieldNames.map(fieldName => row[fieldName])
        );
        
        doc.autoTable({
          head: [fieldNames],
          body: tableData,
        });
        
        doc.save(`${filename}.pdf`);
        */
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}; 