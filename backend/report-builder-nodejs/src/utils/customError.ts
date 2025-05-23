import { ErrorCode } from "../types/response.types";

export class CustomError extends Error {
    public statusCode: number;
    public errorCode: ErrorCode;
    public details?: any;
    public field?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
        details?: any,
        field?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.field = field;

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}