import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';


// Minimal type describing the telemetry tools returned by getTelemetryTools
export type TelemetryTools = {
    tracer: Tracer;
    logger: Logger;
    metrics: Metrics;
};

// Small helper to determine environment from NODE_ENV
const NodeEnv = {
    isDevelopment: () => process.env.NODE_ENV === 'development',
    isProduction: () => process.env.NODE_ENV === 'production',
    isQa: () => process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'staging',
};

const getLogLevel = () => {
    if (NodeEnv.isDevelopment()) {
        return 'DEBUG';
    }
    if (NodeEnv.isProduction()) {
        return 'INFO';
    }

    if (NodeEnv.isQa()) {
        return 'DEBUG';
    }

    return 'INFO';
};

export const getTelemetryTools = (serviceName: string, namespace: string): TelemetryTools => {
    const tracer = new Tracer({ serviceName });
    const logger = new Logger({ serviceName, logLevel: getLogLevel() });
    const metrics = new Metrics({ serviceName, namespace });

    return { tracer, logger, metrics };
};

export const telemetryMiddleware = ({ logger, tracer, metrics }: TelemetryTools) => {
    return [
        captureLambdaHandler(tracer),
        injectLambdaContext(logger),
        logMetrics(metrics, { captureColdStartMetric: true }),
    ];
};

// No Lambda handler code here; only utilities for use in Lambda functions

// Export getLogLevel if needed externally
export { getLogLevel };
