import { APIGatewayProxyResult } from 'aws-lambda';

export interface ResponseHeaders {
  [key: string]: string | boolean;
}

const DEFAULT_HEADERS: ResponseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

export class ResponseBuilder {
  private statusCode: number = 200;
  private headers: ResponseHeaders = { ...DEFAULT_HEADERS };
  private body: any = {};

  setStatusCode(code: number): ResponseBuilder {
    this.statusCode = code;
    return this;
  }

  addHeader(key: string, value: string): ResponseBuilder {
    this.headers[key] = value;
    return this;
  }

  addHeaders(headers: ResponseHeaders): ResponseBuilder {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setBody(body: any): ResponseBuilder {
    this.body = body;
    return this;
  }

  build(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      headers: this.headers as Record<string, string>,
      body: typeof this.body === 'string' ? this.body : JSON.stringify(this.body),
    };
  }
}

export const createResponse = () => new ResponseBuilder();

export const successResponse = (data: any, statusCode: number = 200): APIGatewayProxyResult => {
  return createResponse()
    .setStatusCode(statusCode)
    .setBody(data)
    .build();
};

export const errorResponse = (
  message: string,
  statusCode: number = 500,
  details?: any
): APIGatewayProxyResult => {
  return createResponse()
    .setStatusCode(statusCode)
    .setBody({
      error: message,
      ...(details && { details }),
    })
    .build();
};

export const notFoundResponse = (resource: string = 'Resource'): APIGatewayProxyResult => {
  return errorResponse(`${resource} not found`, 404);
};

export const unauthorizedResponse = (message: string = 'Unauthorized'): APIGatewayProxyResult => {
  return errorResponse(message, 401);
};

export const badRequestResponse = (message: string, details?: any): APIGatewayProxyResult => {
  return errorResponse(message, 400, details);
};

export const createdResponse = (data: any): APIGatewayProxyResult => {
  return successResponse(data, 201);
};

export const noContentResponse = (): APIGatewayProxyResult => {
  return {
    statusCode: 204,
    headers: DEFAULT_HEADERS as Record<string, string>,
    body: '',
  };
};

