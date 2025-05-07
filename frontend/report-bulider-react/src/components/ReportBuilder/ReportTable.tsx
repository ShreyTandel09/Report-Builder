import React from 'react';
import { Field, ReportData, SortConfig } from '../../types';
import styles from '../../styles/ReportTable.module.css';

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

    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        try {
            const fieldData = e.dataTransfer.getData('application/json');
            console.log(fieldData);
            if (fieldData) {
                const field = JSON.parse(fieldData);
                onAddField(field);
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
                            data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? styles.tableBodyRowEven : styles.tableBodyRowOdd}>
                                        {selectedFields.map(field => (
                                            <td key={field.id} className={styles.tableBodyCell}>
                                                {row[field.name]}
                                            </td>
                                        ))}
                                        {/* Empty cell for the "Add column" header */}
                                        <td className={styles.emptyBodyCell}></td>
                                    </tr>
                                ))
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
        </div>
    );
};

export default ReportTable; 