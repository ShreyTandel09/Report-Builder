// src/types/index.ts
import React from 'react';

// Field definition for report
export interface Field {
  id: string;
  name: string;
  type: string;
  label?: string;
  field_name?: string;
  source_table?: string;
  data_type?: string;
}

// Report data record type
export interface ReportData {
  [key: string]: string | number | null;
}

// Sort configuration for table
export interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

// Style definitions
export interface StylesObject {
  [key: string]: React.CSSProperties;
}