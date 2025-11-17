import middy from '@middy/core';
import { Logger, Metrics } from './telemetry';

export interface MiddyContext {
  logger: Logger;
  metrics: Metrics;
  startTime: number;
}

/**
 * Logger middleware - adds logger instance to context
 */
export const loggerMiddleware = (): middy.MiddlewareObj => {
  return {
    before: async (request) => {
      const logger = new Logger({
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
      const logger = request.context.logger as Logger;
      logger.info('Request completed successfully', {
        statusCode: request.response?.statusCode,
      });
    },
    onError: async (request) => {
      const logger = request.context.logger as Logger;
      logger.error('Request failed', request.error);
    },
  };
};

/**
 * Metrics middleware - adds metrics instance to context and tracks performance
 */
export const metricsMiddleware = (): middy.MiddlewareObj => {
  return {
    before: async (request) => {
      const metrics = new Metrics();
      request.context.metrics = metrics;
      request.context.startTime = Date.now();
    },
    after: async (request) => {
      const metrics = request.context.metrics as Metrics;
      const startTime = request.context.startTime as number;

      metrics.recordDuration('LambdaDuration', startTime);
      metrics.addMetric({ name: 'SuccessfulRequests', value: 1 });
      metrics.flush();
    },
    onError: async (request) => {
      const metrics = request.context.metrics as Metrics;
      metrics.addMetric({ name: 'FailedRequests', value: 1 });
      metrics.flush();
    },
  };
};

/**
 * Exception handler middleware - formats errors properly
 */
export const exceptionHandlerMiddleware = (): middy.MiddlewareObj => {
  return {
    onError: async (request) => {
      const logger = request.context.logger as Logger;
      const error = request.error;

      // Log the error
      if (logger) {
        logger.error('Exception caught', error);
      }

      // Handle different error types
      if (error.statusCode) {
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
      } else {
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

/**
 * Authorization middleware - checks if user is authenticated
 */
export const authMiddleware = (): middy.MiddlewareObj => {
  return {
    before: async (request) => {
      const userId = request.event.requestContext?.authorizer?.claims?.sub;
      const logger = request.context.logger as Logger;

      if (!userId) {
        logger?.warn('Unauthorized access attempt');
        const error: any = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
      }

      // Add userId to context for easy access
      request.context.userId = userId;
    },
  };
};

/**
 * Custom error class for HTTP errors
 */
export class HttpError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }
}

export const createHttpError = {
  badRequest: (message: string, details?: any) => new HttpError(400, message, details),
  unauthorized: (message: string = 'Unauthorized') => new HttpError(401, message),
  forbidden: (message: string = 'Forbidden') => new HttpError(403, message),
  notFound: (message: string = 'Resource not found') => new HttpError(404, message),
  conflict: (message: string = 'Conflict') => new HttpError(409, message),
  internalError: (message: string = 'Internal server error') => new HttpError(500, message),
};

