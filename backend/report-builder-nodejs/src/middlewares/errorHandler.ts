import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { ResponseHelper } from '../utils/responseHelper';
import { ErrorCode } from '../types/response.types';

export const errorHandler = (
    error: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    console.error('Error:', error);

    if (error instanceof CustomError) {
        return ResponseHelper.error(
            res,
            error.message,
            error.statusCode,
            error.errorCode,
            error.details,
            error.field
        );
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
        return ResponseHelper.validationError(res, error.message);
    }

    if (error.name === 'CastError') {
        return ResponseHelper.badRequest(res, 'Invalid ID format');
    }

    if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        return ResponseHelper.conflict(res, 'Duplicate entry found');
    }

    // Default server error
    return ResponseHelper.error(
        res,
        'Internal server error',
        500,
        ErrorCode.INTERNAL_SERVER_ERROR
    );
};
