import { APIGatewayProxyResult } from 'aws-lambda';
export interface ResponseHeaders {
    [key: string]: string | boolean;
}
export declare class ResponseBuilder {
    private statusCode;
    private headers;
    private body;
    setStatusCode(code: number): ResponseBuilder;
    addHeader(key: string, value: string): ResponseBuilder;
    addHeaders(headers: ResponseHeaders): ResponseBuilder;
    setBody(body: any): ResponseBuilder;
    build(): APIGatewayProxyResult;
}
export declare const createResponse: () => ResponseBuilder;
export declare const successResponse: (data: any, statusCode?: number) => APIGatewayProxyResult;
export declare const errorResponse: (message: string, statusCode?: number, details?: any) => APIGatewayProxyResult;
export declare const notFoundResponse: (resource?: string) => APIGatewayProxyResult;
export declare const unauthorizedResponse: (message?: string) => APIGatewayProxyResult;
export declare const badRequestResponse: (message: string, details?: any) => APIGatewayProxyResult;
export declare const createdResponse: (data: any) => APIGatewayProxyResult;
export declare const noContentResponse: () => APIGatewayProxyResult;
export declare class HttpError extends Error {
    statusCode: number;
    details?: any;
    constructor(statusCode: number, message: string, details?: any);
}
export declare const createHttpError: {
    badRequest: (message?: string, details?: any) => HttpError;
    unauthorized: (message?: string, details?: any) => HttpError;
    forbidden: (message?: string, details?: any) => HttpError;
    notFound: (message?: string, details?: any) => HttpError;
    conflict: (message?: string, details?: any) => HttpError;
    unprocessableEntity: (message?: string, details?: any) => HttpError;
    internalServerError: (message?: string, details?: any) => HttpError;
};
