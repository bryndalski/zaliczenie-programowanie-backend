export interface LogContext {
  functionName?: string;
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = {
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      ...context,
    };
  }

  private log(level: string, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...(data && { data }),
    };
    console.log(JSON.stringify(logEntry));
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  error(message: string, error?: Error | any) {
    this.log('ERROR', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
  }

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }
}

export interface MetricData {
  name: string;
  value: number;
  unit?: string;
  dimensions?: Record<string, string>;
}

export class Metrics {
  private metrics: MetricData[] = [];

  addMetric(metric: MetricData) {
    this.metrics.push({
      timestamp: Date.now(),
      ...metric,
    } as any);
  }

  recordDuration(name: string, startTime: number) {
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

export const createLogger = (context?: LogContext) => new Logger(context);
export const createMetrics = () => new Metrics();

