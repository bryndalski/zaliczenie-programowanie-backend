import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger, Metrics } from './telemetry';
export interface MiddyContext extends Context {
    logger: Logger;
    metrics: Metrics;
    startTime: number;
    userId: string;
}
/**
 * Logger middleware - adds logger instance to context
 */
export declare const loggerMiddleware: () => middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext>;
/**
 * Metrics middleware - adds metrics instance to context and tracks performance
 */
export declare const metricsMiddleware: () => middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext>;
/**
 * Exception handler middleware - formats errors properly
 */
export declare const exceptionHandlerMiddleware: () => middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext>;
/**
 * Authorization middleware - checks if user is authenticated
 */
export declare const authMiddleware: () => middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext>;
