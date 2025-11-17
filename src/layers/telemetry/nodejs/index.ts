export * from './telemetry';
export * from './http-response';
export * from './middleware';

// Factory functions
import { Logger, Metrics, LogContext } from './telemetry';

export const createLogger = (context?: LogContext) => new Logger(context);
export const createMetrics = () => new Metrics();


