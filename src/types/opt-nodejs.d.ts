declare module '/opt/nodejs' {
  import middy from '@middy/core';

  // Telemetry exports
  export interface LogContext {
    functionName?: string;
    requestId?: string;
    userId?: string;
    [key: string]: any;
  }

  export class Logger {
    constructor(context?: LogContext);
    info(message: string, data?: any): void;
    error(message: string, error?: Error | any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
    setContext(context: Partial<LogContext>): void;
  }

  export class Metrics {
    constructor();
    addMetric(metric: { name: string; value: number; unit?: string }): void;
    recordDuration(name: string, startTime: number): void;
    flush(): void;
  }

  export function createLogger(context?: LogContext): Logger;
  export function createMetrics(): Metrics;

  // Middleware exports
  export interface MiddyContext {
    logger: Logger;
    metrics: Metrics;
    startTime: number;
    userId?: string;
  }

  export function loggerMiddleware(): middy.MiddlewareObj;
  export function metricsMiddleware(): middy.MiddlewareObj;
  export function exceptionHandlerMiddleware(): middy.MiddlewareObj;
  export function authMiddleware(): middy.MiddlewareObj;

  export class HttpError extends Error {
    statusCode: number;
    details?: any;
    constructor(statusCode: number, message: string, details?: any);
  }

  export const createHttpError: {
    badRequest: (message: string, details?: any) => HttpError;
    unauthorized: (message?: string) => HttpError;
    forbidden: (message?: string) => HttpError;
    notFound: (message?: string) => HttpError;
    conflict: (message?: string) => HttpError;
    internalError: (message?: string) => HttpError;
  };

  // DynamoDB helper exports
  export interface DbItem {
    [key: string]: any;
  }

  export class DynamoDBHelper {
    constructor(tableName: string);
    put(item: DbItem): Promise<void>;
    get(key: DbItem): Promise<DbItem | null>;
    query(
      keyConditionExpression: string,
      expressionAttributeValues: DbItem,
      expressionAttributeNames?: DbItem,
      indexName?: string
    ): Promise<DbItem[]>;
    update(
      key: DbItem,
      updateExpression: string,
      expressionAttributeValues: DbItem,
      expressionAttributeNames?: DbItem
    ): Promise<DbItem>;
    delete(key: DbItem): Promise<void>;
    scan(
      filterExpression?: string,
      expressionAttributeValues?: DbItem,
      expressionAttributeNames?: DbItem
    ): Promise<DbItem[]>;
  }

  export function createDynamoDBHelper(tableName: string): DynamoDBHelper;

  // HTTP Response helpers
  export function successResponse(data: any, statusCode?: number): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function errorResponse(
    message: string,
    statusCode?: number,
    error?: any
  ): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function unauthorizedResponse(message?: string): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function badRequestResponse(message: string): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function notFoundResponse(message?: string): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function createdResponse(data: any): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };

  export function noContentResponse(): {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };
}



