import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpCors from '@middy/http-cors';
import { randomUUID } from 'crypto';

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
} from '/opt/nodejs';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

interface NoteInput {
  title: string;
  content: string;
}

interface AddNoteEvent extends APIGatewayProxyEvent {
  body: NoteInput;
}

const baseHandler = async (
  event: AddNoteEvent,
  context: Context & MiddyContext
): Promise<APIGatewayProxyResult> => {
  const { logger, metrics, userId } = context;

  logger.info('Processing add note request');

  const input = event.body;

  // Validate input
  if (!input || !input.title || !input.content) {
    logger.warn('Invalid input', { input });
    throw createHttpError.badRequest('Missing required fields: title and content');
  }

  // Create note
  const noteId = randomUUID();
  const timestamp = new Date().toISOString();

  const note = {
    userId,
    noteId,
    title: input.title,
    content: input.content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Save to DynamoDB
  await dynamoDB.put(note);

  logger.info('Note created successfully', { noteId });
  metrics.addMetric({ name: 'NotesCreated', value: 1 });

  return createdResponse({
    message: 'Note created successfully',
    note,
  });
};

export const handler = middy(baseHandler)
  .use(loggerMiddleware())
  .use(metricsMiddleware())
  .use(authMiddleware())
  .use(httpJsonBodyParser())
  .use(httpCors())
  .use(exceptionHandlerMiddleware());


