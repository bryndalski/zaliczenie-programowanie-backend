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
  createdResponse,
  MiddyContext,
} from '../../layers/telemetry/nodejs';
} from '/opt/nodejs';
// Import shared entities
import { NoteEntity, CreateNoteInput } from '../../entities';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

const baseHandler = async (
  event: APIGatewayProxyEvent,
  context: Context & MiddyContext
): Promise<APIGatewayProxyResult> => {
  const { logger, metrics, userId } = context;

  logger.info('Processing add note request');

  // After httpJsonBodyParser middleware, body is parsed
  const input = event.body as unknown as CreateNoteInput;

  try {
    const noteEntity = NoteEntity.create(userId, input);

    await dynamoDB.put(noteEntity.toJSON());

    logger.info('Note created successfully', { noteId: noteEntity.noteId });
    metrics.addMetric({ name: 'NotesCreated', value: 1 });

    return createdResponse({
      note: noteEntity.toJSON(),
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.warn('Validation error', { error: error.message });
      throw createHttpError.badRequest(error.message);
    }
    throw error;
  }
};

export const handler = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());




