// types/response.types.ts
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        details?: any;
        field?: string;
    };
    timestamp: string;
}

export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST = 'BAD_REQUEST',
    CONFLICT = 'CONFLICT',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS'
}