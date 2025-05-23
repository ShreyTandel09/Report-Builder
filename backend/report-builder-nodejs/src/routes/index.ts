import express, { Router } from 'express';
import {  exportReport, getAvailableFields,getReport } from '../controllers/reportController';

// Create router instance
const router = Router();

// Support both POST and GET methods for the report endpoint
router.get('/get-available-fields', getAvailableFields);
router.post('/get-report-data',getReport)

router.post('/export-report-data-excel', exportReport);


export default router;