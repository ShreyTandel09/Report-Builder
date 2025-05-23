import { Response } from 'express';
import { ApiResponse, ErrorCode } from '../types/response.types';

export class ResponseHelper {
    // Success response
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = 200
    ): Response<ApiResponse<T>> {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        return res.status(statusCode).json(response);
    }

    // Error response
    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
        details?: any,
        field?: string
    ): Response<ApiResponse> {
        const response: ApiResponse = {
            success: false,
            message,
            error: {
                code: errorCode,
                details,
                field
            },
            timestamp: new Date().toISOString()
        };

        return res.status(statusCode).json(response);
    }

    // Validation error
    static validationError(
        res: Response,
        message: string = 'Validation failed',
        details?: any,
        field?: string
    ): Response<ApiResponse> {
        return this.error(res, message, 400, ErrorCode.VALIDATION_ERROR, details, field);
    }

    // Not found error
    static notFound(
        res: Response,
        message: string = 'Resource not found'
    ): Response<ApiResponse> {
        return this.error(res, message, 404, ErrorCode.NOT_FOUND);
    }

    // Unauthorized error
    static unauthorized(
        res: Response,
        message: string = 'Unauthorized access'
    ): Response<ApiResponse> {
        return this.error(res, message, 401, ErrorCode.UNAUTHORIZED);
    }

    // Forbidden error
    static forbidden(
        res: Response,
        message: string = 'Access forbidden'
    ): Response<ApiResponse> {
        return this.error(res, message, 403, ErrorCode.FORBIDDEN);
    }

    // Conflict error
    static conflict(
        res: Response,
        message: string = 'Resource conflict'
    ): Response<ApiResponse> {
        return this.error(res, message, 409, ErrorCode.CONFLICT);
    }

    // Bad request error
    static badRequest(
        res: Response,
        message: string = 'Bad request',
        details?: any
    ): Response<ApiResponse> {
        return this.error(res, message, 400, ErrorCode.BAD_REQUEST, details);
    }
}
