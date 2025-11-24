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
export const loggerMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext> => {
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

      (request.context as any).logger = logger;
      logger.info('Request started', {
        httpMethod: request.event.httpMethod,
        path: request.event.path,
      });
    },
    after: async (request) => {
      const logger = (request.context as any).logger as Logger;
      logger.info('Request completed successfully', {
        statusCode: request.response?.statusCode,
      });
    },
    onError: async (request) => {
      const logger = (request.context as any).logger as Logger;
      logger.error('Request failed', request.error);
    },
  };
};

/**
 * Metrics middleware - adds metrics instance to context and tracks performance
 */
export const metricsMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext> => {
  return {
    before: async (request) => {
      const metrics = new Metrics();
      (request.context as any).metrics = metrics;
      (request.context as any).startTime = Date.now();
    },
    after: async (request) => {
      const metrics = (request.context as any).metrics as Metrics;
      const startTime = (request.context as any).startTime as number;

      metrics.recordDuration('LambdaDuration', startTime);
      metrics.addMetric({ name: 'SuccessfulRequests', value: 1 });
      metrics.flush();
    },
    onError: async (request) => {
      const metrics = (request.context as any).metrics as Metrics;
      metrics.addMetric({ name: 'FailedRequests', value: 1 });
      metrics.flush();
    },
  };
};

/**
 * Exception handler middleware - formats errors properly
 */
export const exceptionHandlerMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext> => {
  return {
    onError: async (request) => {
      const logger = (request.context as any).logger as Logger;
      const error = request.error;

      // Log the error
      if (logger) {
        logger.error('Exception caught', error);
      }

      // Handle different error types
      if (error && (error as any).statusCode) {
        // Already an HTTP error
        request.response = {
          statusCode: (error as any).statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: error.message || 'An error occurred',
            ...((error as any).details && { details: (error as any).details }),
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
export const authMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, MiddyContext> => {
  return {
    before: async (request) => {
      const userId = request.event.requestContext?.authorizer?.claims?.sub;
      const logger = (request.context as any).logger as Logger;

      if (!userId) {
        logger?.warn('Unauthorized access attempt');
        const error: any = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
      }

      // Add userId to context for easy access
      (request.context as any).userId = userId;
    },
  };
};
