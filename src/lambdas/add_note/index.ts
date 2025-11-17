import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';

// Import from Lambda layers
import { createLogger, createMetrics } from '/opt/nodejs';
import { createDynamoDBHelper } from '/opt/nodejs';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  createdResponse,
} from '/opt/nodejs';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const logger = createLogger();
const metrics = createMetrics();
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

interface NoteInput {
  title: string;
  content: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();

  try {
    logger.info('Processing add note request', {
      requestId: event.requestContext.requestId,
    });

    // Get userId from Cognito claims
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!userId) {
      logger.warn('Unauthorized access attempt');
      metrics.addMetric({ name: 'UnauthorizedAttempts', value: 1 });
      return unauthorizedResponse();
    }

    logger.setContext({ userId });

    // Parse request body
    if (!event.body) {
      logger.warn('Missing request body');
      return badRequestResponse('Missing request body');
    }

    const input: NoteInput = JSON.parse(event.body);

    // Validate input
    if (!input.title || !input.content) {
      logger.warn('Invalid input', { input });
      return badRequestResponse('Missing required fields: title and content');
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

    // Save to DynamoDB using helper
    await dynamoDB.put(note);

    logger.info('Note created successfully', { noteId });
    metrics.addMetric({ name: 'NotesCreated', value: 1 });
    metrics.recordDuration('CreateNoteDuration', startTime);

    return createdResponse({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    logger.error('Error creating note', error);
    metrics.addMetric({ name: 'CreateNoteErrors', value: 1 });

    return errorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    metrics.flush();
  }
};

