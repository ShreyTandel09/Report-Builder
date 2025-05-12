import React, { useState, useEffect } from 'react';
import { Column, Field, ReportData, SortConfig } from '../../types';
import styles from '../../styles/ReportTable.module.css';
import { getReportData } from '../../service/api/reportBuilderService';

interface ReportTableProps {
    selectedFields: Field[];
    data: ReportData[];
    onAddField: (field: Field) => void;
    onRemoveField: (fieldId: string) => void;
    sortConfig: SortConfig;
    onRequestSort: (key: string) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
    selectedFields,
    data,
    onAddField,
    onRemoveField,
    sortConfig,
    onRequestSort
}) => {
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [fieldData, setFieldData] = useState<Field[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    // Helper to check if a field is the net_sales_qty field
    const isNetSalesQtyField = (field: Field): boolean => {
        return field.name === 'net_sales_qty' ||
            field.field_name === 'net_sales_qty' ||
            field.field_key === 'net_sales_qty';
    };

    // Check if net_sales_qty column exists in selected fields
    const netSalesQtyField = selectedFields.find(isNetSalesQtyField);

    // Convert fields to columns for API request
    const convertFieldsToColumns = (fields: Field[]): Column[] => {
        return fields.map(field => ({
            field_name: field.field_name || '',
            label: field.label || ''
        }));
    };

    // Fetch report data from API
    const fetchReportData = async (fields: Field[]): Promise<void> => {
        if (!fields.length) return;

        try {
            const columns = convertFieldsToColumns(fields);
            const response = await getReportData({
                columns: columns,
                date: selectedDate
            });

            const flatData = Array.isArray(response.data) ? [...response.data] : [response.data];
            setReportData(flatData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    // Calculate total for a column
    const calculateColumnTotal = (fieldKey: string): number | null => {
        if (!reportData.length || !reportData[0][fieldKey]) return null;

        const values = reportData[0][fieldKey];
        if (!Array.isArray(values)) return null;

        return values.reduce((sum, val) => {
            const parsed = parseFloat(val as string);
            return sum + (isNaN(parsed) ? 0 : parsed);
        }, 0);
    };

    // Event handlers
    const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedDate(e.target.value);
    };

    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        try {
            const fieldDataString = e.dataTransfer.getData('application/json');
            if (!fieldDataString) return;

            const field = JSON.parse(fieldDataString);
            const updatedFields = [...fieldData, field];

            setFieldData(updatedFields);
            onAddField(field);
            fetchReportData(updatedFields);
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };

    const getSortDirectionIcon = (name: string): string | null => {
        if (sortConfig.key !== name) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    // Effect to fetch data when date changes
    useEffect(() => {
        if (fieldData.length > 0) {
            fetchReportData(fieldData);
        }
    }, [selectedDate]);

    // Render functions
    const renderHeaderCells = () => {
        if (selectedFields.length === 0) {
            return (
                <th
                    className={styles.emptyHeaderCell}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className={styles.emptyHeaderText}>
                        Drop fields here to add columns
                    </div>
                </th>
            );
        }

        return (
            <>
                {selectedFields.map(field => (
                    <th
                        key={field.id}
                        className={styles.headerCell}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => onRequestSort(field.name)}
                        aria-sort={(sortConfig.key === field.name ?
                            sortConfig.direction as 'ascending' | 'descending' :
                            'none')}
                    >
                        <div className={styles.headerCellContent}>
                            <span className={styles.headerCellText}>
                                {field.name}
                                {getSortDirectionIcon(field.name) && (
                                    <span className={styles.sortIcon}>
                                        {getSortDirectionIcon(field.name)}
                                    </span>
                                )}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveField(field.id);
                                }}
                                className={styles.removeButton}
                                aria-label={`Remove ${field.name} column`}
                            >
                                ×
                            </button>
                        </div>
                    </th>
                ))}

                {/* Extra droppable cell to add more columns */}
                <th
                    className={styles.addColumnCell}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className={styles.addColumnText}>
                        + Add column
                    </div>
                </th>
            </>
        );
    };

    const renderDataRows = () => {
        if (selectedFields.length === 0) {
            return (
                <tr>
                    <td className={styles.emptyTableMessage}>
                        Your report data will appear here
                    </td>
                </tr>
            );
        }

        if (reportData.length === 0) {
            return (
                <tr>
                    <td
                        colSpan={selectedFields.length + 1}
                        className={styles.emptyTableMessage}
                    >
                        No data available
                    </td>
                </tr>
            );
        }

        // Get data array length from first field
        const firstFieldKey = selectedFields[0]?.field_key || '';
        const dataArray = reportData[0][firstFieldKey] || [];
        const rowCount = Array.isArray(dataArray) ? dataArray.length : 0;

        return (
            <>
                {/* Render data rows */}
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.tableBodyRowEven : styles.tableBodyRowOdd}>
                        {selectedFields.map(field => {
                            const fieldKey = field.field_key || '';
                            const valueArray = reportData[0][fieldKey];
                            const cellValue = Array.isArray(valueArray) ? valueArray[rowIndex] : undefined;

                            return (
                                <td key={field.id} className={styles.tableBodyCell}>
                                    {cellValue}
                                </td>
                            );
                        })}
                        <td className={styles.emptyBodyCell}></td>
                    </tr>
                ))}

                {/* Render total row if net_sales_qty exists */}
                {netSalesQtyField && (
                    <tr className={styles.totalRow}>
                        {selectedFields.map(field => {
                            const fieldKey = field.field_key || '';

                            return (
                                <td key={field.id} className={styles.totalCell}>
                                    {isNetSalesQtyField(field) ? (
                                        <>
                                            <span className={styles.totalLabel}>Total: </span>
                                            <span className={styles.totalValue}>
                                                {calculateColumnTotal(fieldKey)?.toLocaleString()}
                                            </span>
                                        </>
                                    ) : field === selectedFields[0] ? (
                                        <span className={styles.totalSummaryText}>Summary</span>
                                    ) : null}
                                </td>
                            );
                        })}
                        <td className={styles.emptyBodyCell}></td>
                    </tr>
                )}
            </>
        );
    };

    return (
        <div className={styles.tableContainer}>
            {/* Date picker control */}
            <div className={styles.datePickerContainer}>
                <label htmlFor="report-date" className={styles.datePickerLabel}>
                    Report Date:
                </label>
                <input
                    type="date"
                    id="report-date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={styles.datePicker}
                />
            </div>

            <div className={styles.scrollContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerRow}>
                            {renderHeaderCells()}
                        </tr>
                    </thead>
                    <tbody>
                        {renderDataRows()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportTable; 