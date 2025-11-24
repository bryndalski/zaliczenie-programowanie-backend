export * from './telemetry';
export {
  ResponseBuilder,
  createResponse,
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  badRequestResponse,
  createdResponse,
  noContentResponse,
  createHttpError
} from './http-response';
export {
  MiddyContext,
  loggerMiddleware,
  metricsMiddleware,
  exceptionHandlerMiddleware,
  authMiddleware
} from './middleware';

// Factory functions
import { Logger, Metrics, LogContext } from './telemetry';

export const createLogger = (context?: LogContext) => new Logger(context);
export const createMetrics = () => new Metrics();
