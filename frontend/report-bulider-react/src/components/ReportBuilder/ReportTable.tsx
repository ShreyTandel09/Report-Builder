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
    const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [fieldData, setFieldData] = useState<Field[]>([]);

    // Add state for the date field with default to today's date
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    console.log("availableData data:", reportData);

    const getReportDataApi = async (fields: Field[]) => {
        console.log("Field being processed:", fields);
        // console.log("Field data:", fields.length);

        let columns: Column[] = [];
        if (fields.length === 1) {
            // console.log("Fields:", fields[0].field_name, fields[0].label);
            columns.push(
                {
                    field_name: fields[0].field_name || '',
                    label: fields[0].label || ''
                },
            )
        } else {
            fields.forEach(field => {
                columns.push(
                    {
                        field_name: field.field_name || '',
                        label: field.label || ''
                    },
                )
            })
        }
        console.log("Columns:", columns);
        try {
            // Include the selectedDate in the API request
            const response = await getReportData({
                columns: columns,
                date: selectedDate
            });
            console.log("API response data:", response.data);

            const flatData = Array.isArray(response.data) ? [...response.data] : [response.data];
            console.log('Flattened data:', flatData);

            setReportData(flatData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    }

    // Add useEffect to fetch data when date changes
    useEffect(() => {
        if (fieldData.length > 0) {
            getReportDataApi(fieldData);
        }
    }, [selectedDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedDate(e.target.value);
    };

    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        try {
            const fieldDataString = e.dataTransfer.getData('application/json');

            if (fieldDataString) {
                const field = JSON.parse(fieldDataString);
                console.log("Parsed field:", field);
                const updatedFields = [...fieldData, field];
                setFieldData(updatedFields);
                onAddField(field);
                getReportDataApi(updatedFields);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };

    const getSortDirectionIcon = (name: string): string | null => {
        if (sortConfig.key !== name) {
            return null;
        }
        return sortConfig.direction === 'ascending'
            ? '↑'
            : '↓';
    };

    return (
        <div className={styles.tableContainer}>
            {/* Add the date picker control */}
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
                            {selectedFields.length === 0 ? (
                                <th
                                    className={styles.emptyHeaderCell}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className={styles.emptyHeaderText}>
                                        Drop fields here to add columns
                                    </div>
                                </th>
                            ) : (
                                selectedFields.map(field => (
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
                                ))
                            )}

                            {/* Extra droppable cell to add more columns */}
                            {selectedFields.length > 0 && (
                                <th
                                    className={styles.addColumnCell}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <div className={styles.addColumnText}>
                                        + Add column
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedFields.length === 0 ? (
                            <tr>
                                <td className={styles.emptyTableMessage}>
                                    Your report data will appear here
                                </td>
                            </tr>
                        ) : (
                            reportData.length > 0 ? (
                                (() => {
                                    // Find the first field key to determine array length
                                    const firstFieldKey = selectedFields[0]?.field_key || '';
                                    const dataArray = reportData[0][firstFieldKey] || [];
                                    const rowCount = Array.isArray(dataArray) ? dataArray.length : 0;

                                    return Array.from({ length: rowCount }).map((_, rowIndex) => (
                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.tableBodyRowEven : styles.tableBodyRowOdd}>
                                            {selectedFields.map(field => {
                                                console.log("Field in row rendering:", field);
                                                console.log("Row data:", reportData[0]);
                                                const fieldKey = field.field_key || '';
                                                console.log("Field key:", fieldKey);

                                                // Get the array for this field and the value at current index
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
                                    ));
                                })()
                            ) : (
                                <tr>
                                    <td
                                        colSpan={selectedFields.length + 1}
                                        className={styles.emptyTableMessage}
                                    >
                                        No data available
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default ReportTable; 