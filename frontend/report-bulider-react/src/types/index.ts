// src/types/index.ts
import React from 'react';

// Field definition for report
export interface Field {
  id: string;
  name: string;
  type: string;
}

// Report data record type
export interface ReportData {
  [key: string]: string | number;
}

// Sort configuration
export interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

// Style definitions
export interface StylesObject {
  [key: string]: React.CSSProperties;
}