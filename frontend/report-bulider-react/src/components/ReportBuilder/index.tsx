import React, { useState, useEffect } from 'react';
import FieldSidebar from './FieldSidebar';
import ReportTable from './ReportTable';
// import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { Field, ReportData, SortConfig } from '../../types';
import styles from '../../styles/ReportBuilder.module.css';

const ReportBuilder: React.FC = () => {
    // Fix 1: Properly type your state variables
    const [availableFields, setAvailableFields] = useState<Field[]>([
        { id: 'field1', name: 'Customer Name', type: 'text' },
        { id: 'field2', name: 'Email', type: 'email' },
        { id: 'field3', name: 'Purchase Date', type: 'date' },
        { id: 'field4', name: 'Amount', type: 'number' },
        { id: 'field5', name: 'Status', type: 'text' },
        { id: 'field6', name: 'Category', type: 'text' },
        { id: 'field7', name: 'Region', type: 'text' },
        { id: 'field8', name: 'Discount', type: 'number' },
    ]);

    // Fix 2: Explicitly set type for selectedFields
    const [selectedFields, setSelectedFields] = useState<Field[]>([]);

    // Sample data for the report
    const [reportData, setReportData] = useState<ReportData[]>([
        { 'Customer Name': 'John Doe', 'Email': 'john@example.com', 'Purchase Date': '2025-01-15', 'Amount': 250, 'Status': 'Completed', 'Category': 'Electronics', 'Region': 'North', 'Discount': 10 },
        { 'Customer Name': 'Jane Smith', 'Email': 'jane@example.com', 'Purchase Date': '2025-01-18', 'Amount': 120, 'Status': 'Pending', 'Category': 'Clothing', 'Region': 'South', 'Discount': 5 },
        { 'Customer Name': 'Robert Johnson', 'Email': 'robert@example.com', 'Purchase Date': '2025-01-20', 'Amount': 340, 'Status': 'Completed', 'Category': 'Home', 'Region': 'East', 'Discount': 0 },
        { 'Customer Name': 'Sarah Williams', 'Email': 'sarah@example.com', 'Purchase Date': '2025-01-22', 'Amount': 190, 'Status': 'Cancelled', 'Category': 'Books', 'Region': 'West', 'Discount': 15 },
    ]);

    // Fix 3: Initialize sortConfig with proper types
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: 'ascending'  // Must be 'ascending' or 'descending'
    });

    // Fix 4: Proper typing for addField
    const addField = (field: Field): void => {
        try {
            if (!selectedFields.some(f => f.id === field.id)) {
                setSelectedFields([...selectedFields, field]);
            }
        } catch (error) {
            console.error('Error adding field:', error);
        }
    };

    // Fix 5: Change parameter type to string for removeField
    const removeField = (fieldId: string): void => {
        try {
            setSelectedFields(selectedFields.filter(field => field.id !== fieldId));
        } catch (error) {
            console.error('Error removing field:', error);
        }
    };

    // Reset the report
    const resetReport = (): void => {
        setSelectedFields([]);
        setSortConfig({ key: null, direction: 'ascending' });
    };

    // Fix 6: Properly type the direction variable
    const requestSort = (key: string): void => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        // key is already correct type (string)
        setSortConfig({ key, direction });
    };

    // Apply sorting to data
    useEffect(() => {
        if (sortConfig.key) {
            const sortedData = [...reportData].sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            setReportData(sortedData);
        }
    }, [sortConfig, reportData]);  // Fixed dependency array

    // Export functions
    const handleExportCSV = (): void => {
        try {
            if (selectedFields.length === 0) {
                alert('Please add at least one column to your report before exporting');
                return;
            }
            alert("Later")
            // exportToCSV(reportData, selectedFields, 'report-data');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const handleExportPDF = (): void => {
        try {
            if (selectedFields.length === 0) {
                alert('Please add at least one column to your report before exporting');
                return;
            }
            alert("Later")

            // exportToPDF(reportData, selectedFields, 'report-data');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Failed to export PDF. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            {/* Sidebar with available fields */}
            <FieldSidebar
                fields={availableFields}
                onFieldDrop={addField}
            />

            {/* Main content area */}
            <div className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Report Builder</h1>

                <div className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button
                            onClick={resetReport}
                            className={styles.resetButton}
                            aria-label="Reset report"
                        >
                            Reset Report
                        </button>

                        <div className={styles.fieldStatus}>
                            {selectedFields.length === 0 ?
                                "Drag fields from the sidebar to the table header below" :
                                `${selectedFields.length} column(s) added to report`}
                        </div>
                    </div>

                    <div className={styles.exportButtonsContainer}>
                        <button
                            onClick={handleExportCSV}
                            className={`${styles.exportCSVButton} ${selectedFields.length === 0 ? styles.disabledButton : ''}`}
                            disabled={selectedFields.length === 0}
                            aria-label="Export to CSV"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className={`${styles.exportPDFButton} ${selectedFields.length === 0 ? styles.disabledButton : ''}`}
                            disabled={selectedFields.length === 0}
                            aria-label="Export to PDF"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Report table */}
                <ReportTable
                    selectedFields={selectedFields}
                    data={reportData}
                    onAddField={addField}
                    onRemoveField={removeField}
                    sortConfig={sortConfig}
                    onRequestSort={requestSort}
                />

                {/* Instructions box */}
                <div className={styles.instructionsBox}>
                    <strong>How to use:</strong>
                    <ul className={styles.instructionsList}>
                        <li className={styles.instructionItem}>Drag fields from the sidebar to add columns to your report</li>
                        <li className={styles.instructionItem}>Click on column headers to sort the data</li>
                        <li className={styles.instructionItem}>Click the "×" button to remove columns</li>
                        <li className={styles.instructionItem}>Use the export buttons to download your report</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReportBuilder; 