import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/responseHelper';
import { responseMessage } from '../utils/responseMessage.types';
import { createTableService, insertDataTableService, getTableDataService, updateTableDataService, deleteTableDataService } from '../services/tableService';

const creatTable = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await createTableService(req.body);
        return ResponseHelper.success(
            res,
            data,
            responseMessage.TABLE_CREATED,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const insertDataTable = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await insertDataTableService(req.params, req.body);
        return ResponseHelper.success(
            res,
            data,
            responseMessage.DATA_INSERTED,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getTableData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await getTableDataService(req.params);
        return ResponseHelper.success(
            res,
            data,
            responseMessage.TABLE_DATA,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateTableData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await updateTableDataService(req.params, req.body);
        return ResponseHelper.success(
            res,
            data,
            responseMessage.UPDATED_TABLE_DATA,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteTableData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await deleteTableDataService(req.params);
        return ResponseHelper.success(
            res,
            data,
            responseMessage.DELETED_TABLE_DATA
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    creatTable,
    insertDataTable,
    getTableData,
    updateTableData,
    deleteTableData
}