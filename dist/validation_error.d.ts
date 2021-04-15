declare type Location = {
    line: number;
    column: number;
};
export declare type ValidationMessage = {
    targetKey: string;
    messages: string;
};
declare type Response = {
    statusCode: number;
    error: string;
    message: string;
    messages: ValidationMessage[];
};
export declare type Extensions = {
    code: string;
    exception: {
        response: Response;
        status: number;
        message: Response;
        stacktrace: string[];
    };
    validationMessages: ValidationMessage[];
};
export declare type ValidationError = {
    message: string;
    locations: Location[];
    path: string[];
    extensions: Extensions;
};
export declare type ValidationErrorResponse = {
    errors: ValidationError[];
    data: null;
};
export declare const getErrorMessage: (response: ValidationErrorResponse) => string | null;
export declare const getValidationMessages: (response: ValidationErrorResponse) => ValidationMessage[];
export {};
