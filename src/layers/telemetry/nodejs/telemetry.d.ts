export interface LogContext {
    functionName?: string;
    requestId?: string;
    userId?: string;
    [key: string]: any;
}
export declare class Logger {
    private context;
    constructor(context?: LogContext);
    private log;
    info(message: string, data?: any): void;
    error(message: string, error?: Error | any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
    setContext(context: Partial<LogContext>): void;
}
export interface MetricData {
    name: string;
    value: number;
    unit?: string;
    dimensions?: Record<string, string>;
}
export declare class Metrics {
    private metrics;
    addMetric(metric: MetricData): void;
    recordDuration(name: string, startTime: number): void;
    flush(): void;
}
export declare const createLogger: (context?: LogContext) => Logger;
export declare const createMetrics: () => Metrics;
