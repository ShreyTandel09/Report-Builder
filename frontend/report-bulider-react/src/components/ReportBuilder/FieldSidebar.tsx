// src/components/ReportBuilder/FieldSidebar.tsx
import React, { useEffect, useState } from 'react';
import DraggableField from './DraggableField';
import { Field } from '../../types';
import styles from '../../styles/FieldSidebar.module.css';
import { getAvailableFields } from '../../service/api/reportBuilderService';

interface FieldSidebarProps {
    fields: Field[];
    onFieldDrop: (field: Field) => void;
}

const FieldSidebar: React.FC<FieldSidebarProps> = ({ fields, onFieldDrop }) => {
    const [availableFields, setAvailableFields] = useState<Field[]>([]);

    useEffect(() => {
        const fetchAvailableFields = async () => {
            try {
                const response = await getAvailableFields();
                console.log(response.data);
                setAvailableFields(response.data);
            } catch (error) {
                console.error('Error fetching available fields:', error);
            }
        };
        fetchAvailableFields();
    }, []);

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
                {availableFields.map(field => (
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