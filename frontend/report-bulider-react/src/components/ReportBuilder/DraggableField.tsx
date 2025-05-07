import React, { useState } from 'react';
import { Field } from '../../types';
import styles from '../../styles/DraggableField.module.css';
interface DraggableFieldProps {
    field: Field;
    onDrop: (field: Field) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, onDrop }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        try {
            e.dataTransfer.setData('application/json', JSON.stringify(field));
            e.dataTransfer.effectAllowed = 'move';
            setIsDragging(true);
        } catch (error) {
            console.error('Error in drag start:', error);
        }
    };

    const handleDragEnd = (): void => {
        setIsDragging(false);
    };

    // Get the appropriate icon based on field type
    const getFieldIcon = (type: string): string => {
        switch (type) {
            case 'text':
                return '📝';
            case 'number':
                return '🔢';
            case 'date':
                return '📅';
            case 'email':
                return '📧';
            default:
                return '📄';
        }
    };

    return (
        <div
            className={`${styles.draggableField} ${isDragging ? styles.dragging : ''}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            aria-label={`Draggable field: ${field.name}`}
        >
            <div className={styles.fieldIcon}>{getFieldIcon(field.type)}</div>
            <div className={styles.fieldContent}>
                <div className={styles.fieldName}>{field.name}</div>
                <div className={styles.fieldType}>{field.type}</div>
            </div>
        </div>
    );
};

export default DraggableField; 