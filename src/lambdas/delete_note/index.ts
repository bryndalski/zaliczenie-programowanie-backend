import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpCors from '@middy/http-cors';

// Import from Lambda layers
import {
  createDynamoDBHelper,
  loggerMiddleware,
  metricsMiddleware,
  exceptionHandlerMiddleware,
  authMiddleware,
  createHttpError,
  noContentResponse,
  MiddyContext,
} from '/opt/nodejs';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

interface DeleteNoteEvent extends APIGatewayProxyEvent {
  pathParameters: {
    noteId: string;
  };
}

const baseHandler = async (
  event: DeleteNoteEvent,
  context: Context & MiddyContext
): Promise<APIGatewayProxyResult> => {
  const { logger, metrics, userId } = context;

  logger.info('Processing delete note request');

  // Get noteId from path parameters or query parameters
  const noteId = event.pathParameters?.noteId || event.queryStringParameters?.noteId;

  if (!noteId) {
    logger.warn('Missing noteId parameter');
    throw createHttpError.badRequest('Missing noteId parameter');
  }

  // Verify the note exists and belongs to the user
  const existingNote = await dynamoDB.get({
    userId,
    noteId,
  });

  if (!existingNote) {
    logger.warn('Note not found', { noteId });
    throw createHttpError.notFound('Note not found');
  }

  // Delete the note
  await dynamoDB.delete({
    userId,
    noteId,
  });

  logger.info('Note deleted successfully', { noteId });
  metrics.addMetric({ name: 'NotesDeleted', value: 1 });

  return noContentResponse();
};

export const handler = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());


