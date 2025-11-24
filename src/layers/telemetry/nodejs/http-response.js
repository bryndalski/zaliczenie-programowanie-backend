"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpError = exports.HttpError = exports.noContentResponse = exports.createdResponse = exports.badRequestResponse = exports.unauthorizedResponse = exports.notFoundResponse = exports.errorResponse = exports.successResponse = exports.createResponse = exports.ResponseBuilder = void 0;
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};
class ResponseBuilder {
    constructor() {
        this.statusCode = 200;
        this.headers = { ...DEFAULT_HEADERS };
        this.body = {};
    }
    setStatusCode(code) {
        this.statusCode = code;
        return this;
    }
    addHeader(key, value) {
        this.headers[key] = value;
        return this;
    }
    addHeaders(headers) {
        this.headers = { ...this.headers, ...headers };
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    build() {
        return {
            statusCode: this.statusCode,
            headers: this.headers,
            body: typeof this.body === 'string' ? this.body : JSON.stringify(this.body),
        };
    }
}
exports.ResponseBuilder = ResponseBuilder;
const createResponse = () => new ResponseBuilder();
exports.createResponse = createResponse;
const successResponse = (data, statusCode = 200) => {
    return (0, exports.createResponse)()
        .setStatusCode(statusCode)
        .setBody(data)
        .build();
};
exports.successResponse = successResponse;
const errorResponse = (message, statusCode = 500, details) => {
    return (0, exports.createResponse)()
        .setStatusCode(statusCode)
        .setBody({
        error: message,
        ...(details && { details }),
    })
        .build();
};
exports.errorResponse = errorResponse;
const notFoundResponse = (resource = 'Resource') => {
    return (0, exports.errorResponse)(`${resource} not found`, 404);
};
exports.notFoundResponse = notFoundResponse;
const unauthorizedResponse = (message = 'Unauthorized') => {
    return (0, exports.errorResponse)(message, 401);
};
exports.unauthorizedResponse = unauthorizedResponse;
const badRequestResponse = (message, details) => {
    return (0, exports.errorResponse)(message, 400, details);
};
exports.badRequestResponse = badRequestResponse;
const createdResponse = (data) => {
    return (0, exports.successResponse)(data, 201);
};
exports.createdResponse = createdResponse;
const noContentResponse = () => {
    return {
        statusCode: 204,
        headers: DEFAULT_HEADERS,
        body: '',
    };
};
exports.noContentResponse = noContentResponse;
// HTTP Error creation functions
class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.HttpError = HttpError;
exports.createHttpError = {
    badRequest: (message = 'Bad Request', details) => new HttpError(400, message, details),
    unauthorized: (message = 'Unauthorized', details) => new HttpError(401, message, details),
    forbidden: (message = 'Forbidden', details) => new HttpError(403, message, details),
    notFound: (message = 'Not Found', details) => new HttpError(404, message, details),
    conflict: (message = 'Conflict', details) => new HttpError(409, message, details),
    unprocessableEntity: (message = 'Unprocessable Entity', details) => new HttpError(422, message, details),
    internalServerError: (message = 'Internal Server Error', details) => new HttpError(500, message, details),
};
