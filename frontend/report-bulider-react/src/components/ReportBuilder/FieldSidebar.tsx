// src/components/ReportBuilder/FieldSidebar.tsx
import React from 'react';
import DraggableField from './DraggableField';
import { Field } from '../../types';
import styles from '../../styles/FieldSidebar.module.css';

interface FieldSidebarProps {
    fields: Field[];
    onFieldDrop: (field: Field) => void;
}

const FieldSidebar: React.FC<FieldSidebarProps> = ({ fields, onFieldDrop }) => {
    return (
        <div className={styles.sidebar}>
            <h2 className={styles.heading}>Available Fields</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search fields..."
                    disabled
                />
            </div>
            <div className={styles.fieldList}>
                {fields.map(field => (
                    <DraggableField
                        key={field.id}
                        field={field}
                        onDrop={onFieldDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default FieldSidebar;