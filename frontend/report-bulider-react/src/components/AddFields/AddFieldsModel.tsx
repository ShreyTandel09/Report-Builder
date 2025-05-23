import React, { useEffect, useState } from 'react';
import { addNewFieldValue, Field } from '../../types';
import styles from '../../styles/AddFieldsModel.module.css';
import { addNewField, getTableData } from '../../service/api/addFieldService';

interface AddFieldsModelProps {
  isOpen: boolean;
  onClose: () => void;
  availableFields: Field[];
}

const AddFieldsModel: React.FC<AddFieldsModelProps> = ({
  isOpen,
  onClose,
  availableFields
}) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableName, setTableName] = useState<{ source_table: string }[]>([]);
  const [selectedTableName, setSelectedTableName] = useState('');

  useEffect(() => {
    const fetchAvailableFields = async () => {
      try {
        const response = await getTableData();
        setTableName(response.data);
        // Set the first table as default if available
        if (response.data && response.data.length > 0) {
          setSelectedTableName(response.data[0].source_table);
        }
      } catch (error) {
        console.error('Error fetching available fields:', error);
      }
    };
    fetchAvailableFields();
  }, []);

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  const handleAddField = async () => {
    // Validate field name
    if (!newFieldName.trim()) {
      alert('Please enter a field name');
      return;
    }

    // Validate table selection
    if (!selectedTableName.trim()) {
      alert('Please select a source table');
      return;
    }

    // Create a new field object
    const newField: addNewFieldValue = {
      sourceTable: selectedTableName,
      fieldName: newFieldName,
      fieldType: newFieldType
    };

    console.log(newField);
    // Add the field and close the modal

    try {
      const response = await addNewField(newField);
      console.log('Field added:', response);


      // Reset and close
      setNewFieldName('');
      setNewFieldType('text');
      setSelectedTableName(tableName.length > 0 ? tableName[0].source_table : '');
      onClose();
    } catch (error) {
      console.error('Failed to add field:', error);
      alert('Failed to add field. Please try again.');
    }
  };

  // Filter available fields based on search term
  const filteredFields = availableFields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add New Field</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Create new field */}
          <div className={styles.createSection}>
            <div className={styles.fieldGroup}>
              <label htmlFor="sourceTable">Source Table:</label>
              <select
                id="sourceTable"
                className={styles.select}
                value={selectedTableName}
                onChange={(e) => setSelectedTableName(e.target.value)}
              >
                <option value="" disabled>Select a table</option>
                {tableName.map((table, index) => (
                  <option key={index} value={table.source_table}>
                    {table.source_table}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="fieldName">Field Name:</label>
              <input
                id="fieldName"
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Enter field name"
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="fieldType">Field Type:</label>
              <select
                id="fieldType"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className={styles.select}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean</option>
              </select>
            </div>

            <button
              className={styles.addButton}
              onClick={handleAddField}
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFieldsModel;