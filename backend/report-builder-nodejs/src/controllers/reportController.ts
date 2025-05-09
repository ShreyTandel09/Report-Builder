import httpStatus from 'http-status';
import { getAvailableFieldsFromDB,getReportData} from '../services/reportService';
import { Request, Response, NextFunction } from 'express';


const getAvailableFields = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getAvailableFieldsFromDB();
        res.status(httpStatus.OK).json({ data });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
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


export {
    getAvailableFields,
    getReport
}