import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpCors from '@middy/http-cors';

// Import from local layers - these will be available in /opt/nodejs at runtime
import { createDynamoDBHelper } from '../../layers/dynamodb/nodejs';
import {
  loggerMiddleware,
  metricsMiddleware,
  exceptionHandlerMiddleware,
  authMiddleware,
  createHttpError,
  successResponse,
  MiddyContext,
} from '../../layers/telemetry/nodejs';

import { NoteEntity, Note, UpdateNoteInput } from '../../entities';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

const baseHandler = async (
  event: APIGatewayProxyEvent,
  context: Context & MiddyContext
): Promise<APIGatewayProxyResult> => {
  const { logger, metrics, userId } = context;

  logger.info('Processing update note request');

  const noteId = event.pathParameters?.noteId || event.queryStringParameters?.noteId;

  if (!noteId) {
    logger.warn('Missing noteId parameter');
    throw createHttpError.badRequest('Missing noteId parameter');
  }

  // After httpJsonBodyParser middleware, body is parsed
  const input = event.body as unknown as UpdateNoteInput;

  const existingNoteData = await dynamoDB.get({
    userId,
    noteId,
  });

  if (!existingNoteData) {
    logger.warn('Note not found', { noteId });
    throw createHttpError.notFound('Note not found');
  }

  try {
    const noteEntity = NoteEntity.fromData(existingNoteData as Note);

    if (!noteEntity.belongsToUser(userId)) {
      logger.warn('Unauthorized update attempt', { noteId, userId });
      throw createHttpError.forbidden('You do not have permission to update this note');
    }

    noteEntity.update(input);

    await dynamoDB.put(noteEntity.toJSON());

    logger.info('Note updated successfully', { noteId });
    metrics.addMetric({ name: 'NotesUpdated', value: 1 });

    return successResponse({
      message: 'Note updated successfully',
      note: noteEntity.toJSON(),
    });

  } catch (error) {
    if (error instanceof Error && !error.hasOwnProperty('statusCode')) {
      logger.warn('Validation error', { error: error.message });
      throw createHttpError.badRequest(error.message);
    }
    throw error;
  }
};

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());


