
import express, { Router } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import { creatTable, deleteTableData, getTableData, insertDataTable, updateTableData } from '../controllers/tableController';

// Create router instance
const router = Router();

// Support both POST and GET methods for the report endpoint
router.post('/create-table', creatTable);
router.post('/:tableName/data', insertDataTable)
router.get('/:tableName/data', getTableData)
router.put('/:tableName/data/:id', updateTableData)
router.delete('/:tableName/data/:id', deleteTableData)








router.use(errorHandler);
export default router;