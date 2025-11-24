"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetrics = exports.createLogger = exports.authMiddleware = exports.exceptionHandlerMiddleware = exports.metricsMiddleware = exports.loggerMiddleware = exports.createHttpError = exports.noContentResponse = exports.createdResponse = exports.badRequestResponse = exports.unauthorizedResponse = exports.notFoundResponse = exports.errorResponse = exports.successResponse = exports.createResponse = exports.ResponseBuilder = void 0;
__exportStar(require("./telemetry"), exports);
var http_response_1 = require("./http-response");
Object.defineProperty(exports, "ResponseBuilder", { enumerable: true, get: function () { return http_response_1.ResponseBuilder; } });
Object.defineProperty(exports, "createResponse", { enumerable: true, get: function () { return http_response_1.createResponse; } });
Object.defineProperty(exports, "successResponse", { enumerable: true, get: function () { return http_response_1.successResponse; } });
Object.defineProperty(exports, "errorResponse", { enumerable: true, get: function () { return http_response_1.errorResponse; } });
Object.defineProperty(exports, "notFoundResponse", { enumerable: true, get: function () { return http_response_1.notFoundResponse; } });
Object.defineProperty(exports, "unauthorizedResponse", { enumerable: true, get: function () { return http_response_1.unauthorizedResponse; } });
Object.defineProperty(exports, "badRequestResponse", { enumerable: true, get: function () { return http_response_1.badRequestResponse; } });
Object.defineProperty(exports, "createdResponse", { enumerable: true, get: function () { return http_response_1.createdResponse; } });
Object.defineProperty(exports, "noContentResponse", { enumerable: true, get: function () { return http_response_1.noContentResponse; } });
Object.defineProperty(exports, "createHttpError", { enumerable: true, get: function () { return http_response_1.createHttpError; } });
var middleware_1 = require("./middleware");
Object.defineProperty(exports, "loggerMiddleware", { enumerable: true, get: function () { return middleware_1.loggerMiddleware; } });
Object.defineProperty(exports, "metricsMiddleware", { enumerable: true, get: function () { return middleware_1.metricsMiddleware; } });
Object.defineProperty(exports, "exceptionHandlerMiddleware", { enumerable: true, get: function () { return middleware_1.exceptionHandlerMiddleware; } });
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return middleware_1.authMiddleware; } });
// Factory functions
const telemetry_1 = require("./telemetry");
const createLogger = (context) => new telemetry_1.Logger(context);
exports.createLogger = createLogger;
const createMetrics = () => new telemetry_1.Metrics();
exports.createMetrics = createMetrics;
