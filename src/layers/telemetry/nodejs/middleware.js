"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.exceptionHandlerMiddleware = exports.metricsMiddleware = exports.loggerMiddleware = void 0;
const telemetry_1 = require("./telemetry");
/**
 * Logger middleware - adds logger instance to context
 */
const loggerMiddleware = () => {
    return {
        before: async (request) => {
            const logger = new telemetry_1.Logger({
                requestId: request.event.requestContext?.requestId,
                functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
            });
            // Add userId if available from Cognito
            const userId = request.event.requestContext?.authorizer?.claims?.sub;
            if (userId) {
                logger.setContext({ userId });
            }
            request.context.logger = logger;
            logger.info('Request started', {
                httpMethod: request.event.httpMethod,
                path: request.event.path,
            });
        },
        after: async (request) => {
            const logger = request.context.logger;
            logger.info('Request completed successfully', {
                statusCode: request.response?.statusCode,
            });
        },
        onError: async (request) => {
            const logger = request.context.logger;
            logger.error('Request failed', request.error);
        },
    };
};
exports.loggerMiddleware = loggerMiddleware;
/**
 * Metrics middleware - adds metrics instance to context and tracks performance
 */
const metricsMiddleware = () => {
    return {
        before: async (request) => {
            const metrics = new telemetry_1.Metrics();
            request.context.metrics = metrics;
            request.context.startTime = Date.now();
        },
        after: async (request) => {
            const metrics = request.context.metrics;
            const startTime = request.context.startTime;
            metrics.recordDuration('LambdaDuration', startTime);
            metrics.addMetric({ name: 'SuccessfulRequests', value: 1 });
            metrics.flush();
        },
        onError: async (request) => {
            const metrics = request.context.metrics;
            metrics.addMetric({ name: 'FailedRequests', value: 1 });
            metrics.flush();
        },
    };
};
exports.metricsMiddleware = metricsMiddleware;
/**
 * Exception handler middleware - formats errors properly
 */
const exceptionHandlerMiddleware = () => {
    return {
        onError: async (request) => {
            const logger = request.context.logger;
            const error = request.error;
            // Log the error
            if (logger) {
                logger.error('Exception caught', error);
            }
            // Handle different error types
            if (error && error.statusCode) {
                // Already an HTTP error
                request.response = {
                    statusCode: error.statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        error: error.message || 'An error occurred',
                        ...(error.details && { details: error.details }),
                    }),
                };
            }
            else {
                // Generic error
                request.response = {
                    statusCode: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        error: 'Internal server error',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    }),
                };
            }
            return request.response;
        },
    };
};
exports.exceptionHandlerMiddleware = exceptionHandlerMiddleware;
/**
 * Authorization middleware - checks if user is authenticated
 */
const authMiddleware = () => {
    return {
        before: async (request) => {
            const userId = request.event.requestContext?.authorizer?.claims?.sub;
            const logger = request.context.logger;
            if (!userId) {
                logger?.warn('Unauthorized access attempt');
                const error = new Error('Unauthorized');
                error.statusCode = 401;
                throw error;
            }
            // Add userId to context for easy access
            request.context.userId = userId;
        },
    };
};
exports.authMiddleware = authMiddleware;
