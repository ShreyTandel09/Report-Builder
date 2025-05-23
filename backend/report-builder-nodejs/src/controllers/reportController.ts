import httpStatus from 'http-status';
import { addFieldsInDB, exportReportData, getAvailableFieldsFromDB, getReportData, getTableNameDB } from '../services/reportService';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/responseHelper';
import { responseMessage } from '../types/responseMessage.types';



const getAvailableFields = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await getAvailableFieldsFromDB();
        return ResponseHelper.success(
            res,
            data,
            responseMessage.GET_AVAILABLE_FIELD,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const data = await getReportData(req.body);
        res.status(httpStatus.OK).json({ data });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}

const exportReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const buffer = await exportReportData(req.body);

        // Set headers for Excel file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        // Send the buffer directly
        res.status(httpStatus.OK).send(buffer);
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}

const getTableName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getTableNameDB();
        res.status(httpStatus.OK).json({ data });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}

const addFields = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await addFieldsInDB(req.body);
        res.status(httpStatus.OK).json({ data });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}




export {
    getAvailableFields,
    getReport,
    exportReport,
    addFields,
    getTableName
}