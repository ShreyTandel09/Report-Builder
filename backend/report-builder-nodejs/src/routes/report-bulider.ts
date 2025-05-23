
import express, { Router } from 'express';
import { exportReport, getAvailableFields, getReport, addFields, getTableName } from '../controllers/reportController';
import { errorHandler } from '../middlewares/errorHandler';

// Create router instance
const router = Router();

// Support both POST and GET methods for the report endpoint
router.get('/get-available-fields', getAvailableFields);
router.post('/get-report-data', getReport)
router.post('/export-report-data-excel', exportReport);


//Addtional Field sin Report
router.post('/add-field', addFields)
router.get('/get-table', getTableName)


router.use(errorHandler);
export default router;