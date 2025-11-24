"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetrics = exports.createLogger = exports.Metrics = exports.Logger = void 0;
class Logger {
    constructor(context = {}) {
        this.context = {
            functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
            ...context,
        };
    }
    log(level, message, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...this.context,
            ...(data && { data }),
        };
        console.log(JSON.stringify(logEntry));
    }
    info(message, data) {
        this.log('INFO', message, data);
    }
    error(message, error) {
        this.log('ERROR', message, {
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            } : error,
        });
    }
    warn(message, data) {
        this.log('WARN', message, data);
    }
    debug(message, data) {
        this.log('DEBUG', message, data);
    }
    setContext(context) {
        this.context = { ...this.context, ...context };
    }
}
exports.Logger = Logger;
class Metrics {
    constructor() {
        this.metrics = [];
    }
    addMetric(metric) {
        this.metrics.push({
            timestamp: Date.now(),
            ...metric,
        });
    }
    recordDuration(name, startTime) {
        const duration = Date.now() - startTime;
        this.addMetric({
            name,
            value: duration,
            unit: 'Milliseconds',
        });
    }
    flush() {
        if (this.metrics.length > 0) {
            console.log(JSON.stringify({
                _aws: {
                    CloudWatchMetrics: [{
                            Namespace: 'NotesApp',
                            Dimensions: [['FunctionName']],
                            Metrics: this.metrics.map(m => ({
                                Name: m.name,
                                Unit: m.unit || 'None',
                            })),
                        }],
                },
                FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
                ...this.metrics.reduce((acc, m, i) => ({
                    ...acc,
                    [m.name]: m.value,
                }), {}),
            }));
        }
        this.metrics = [];
    }
}
exports.Metrics = Metrics;
const createLogger = (context) => new Logger(context);
exports.createLogger = createLogger;
const createMetrics = () => new Metrics();
exports.createMetrics = createMetrics;
