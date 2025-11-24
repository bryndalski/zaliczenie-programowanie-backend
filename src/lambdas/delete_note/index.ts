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
  createHttpError,
  noContentResponse,
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

  logger.info('Processing delete note request');

  const noteId = event.pathParameters?.noteId || event.queryStringParameters?.noteId;

  if (!noteId) {
    logger.warn('Missing noteId parameter');
    throw createHttpError.badRequest('Missing noteId parameter');
  }

  const existingNoteData = await dynamoDB.get({
    userId,
    noteId,
  });

  if (!existingNoteData) {
    logger.warn('Note not found', { noteId });
    throw createHttpError.notFound('Note not found');
  }

  const noteEntity = NoteEntity.fromData(existingNoteData as Note);

  if (!noteEntity.belongsToUser(userId)) {
    logger.warn('Unauthorized delete attempt', { noteId, userId });
    throw createHttpError.forbidden('You do not have permission to delete this note');
  }

  // Delete the note
  await dynamoDB.delete(noteEntity.getPrimaryKey());

  logger.info('Note deleted successfully', { noteId });
  metrics.addMetric({ name: 'NotesDeleted', value: 1 });

  return noContentResponse();
};

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());




