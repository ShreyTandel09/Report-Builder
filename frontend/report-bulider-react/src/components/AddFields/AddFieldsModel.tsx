import React, { useState } from 'react';
import { Field } from '../../types';
import styles from '../../styles/AddFieldsModel.module.css';

interface AddFieldsModelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: Field) => void;
  availableFields: Field[];
}

const AddFieldsModel: React.FC<AddFieldsModelProps> = ({
  isOpen, 
  onClose, 
  onAddField,
  availableFields
}) => {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [searchTerm, setSearchTerm] = useState('');
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  const handleAddField = () => {
    // Validate field name
    if (!newFieldName.trim()) {
      alert('Please enter a field name');
      return;
    }
    
    // Create a new field object
    const newField: Field = {
      id: `field-${Date.now()}`, // Generate a unique ID
      name: newFieldName,
      type: newFieldType,
      // Add any other required properties for a Field
    };
    
    // Add the field and close the modal
    onAddField(newField);
    setNewFieldName('');
    setNewFieldType('text');
    onClose();
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
            {/* <h3>Create New Field</h3> */}
            {/* <div className={styles.divider}></div> */}

            <div className={styles.fieldGroup}>
              <label htmlFor="fieldName">Source Table:</label>
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