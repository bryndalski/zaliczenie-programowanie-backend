import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpCors from '@middy/http-cors';

import { createDynamoDBHelper } from '../../layers/dynamodb/nodejs';
import {
  loggerMiddleware,
  metricsMiddleware,
  exceptionHandlerMiddleware,
  authMiddleware,
  successResponse,
  MiddyContext,
} from '../../layers/telemetry/nodejs';

import { NoteEntity, Note } from '../../entities';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

const baseHandler = async (
  event: APIGatewayProxyEvent,
  context: Context & MiddyContext
): Promise<APIGatewayProxyResult> => {
  const { logger, metrics, userId } = context;

  logger.info('Processing get notes request');

  const notesData = await dynamoDB.query(
    'userId = :userId',
    { ':userId': userId }
  );

  const notes = notesData.map((data: any) => NoteEntity.fromData(data as Note).toJSON());

  logger.info('Notes retrieved successfully', { count: notes.length });
  metrics.addMetric({ name: 'NotesRetrieved', value: notes.length });

  return successResponse({
    notes,
    count: notes.length,
  });
};

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());



