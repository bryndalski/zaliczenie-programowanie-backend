import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Import from Lambda layers
import { createLogger, createMetrics } from '/opt/nodejs';
import { createDynamoDBHelper } from '/opt/nodejs';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  noContentResponse,
} from '/opt/nodejs';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const logger = createLogger();
const metrics = createMetrics();
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();

  try {
    logger.info('Processing delete note request', {
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

    // Get noteId from path parameters
    const noteId = event.pathParameters?.noteId;

    if (!noteId) {
      logger.warn('Missing noteId parameter');
      return errorResponse('Missing noteId parameter', 400);
    }

    // Verify the note exists and belongs to the user
    const existingNote = await dynamoDB.get({
      userId,
      noteId,
    });

    if (!existingNote) {
      logger.warn('Note not found', { noteId });
      return notFoundResponse('Note');
    }

    // Delete the note
    await dynamoDB.delete({
      userId,
      noteId,
    });

    logger.info('Note deleted successfully', { noteId });
    metrics.addMetric({ name: 'NotesDeleted', value: 1 });
    metrics.recordDuration('DeleteNoteDuration', startTime);

    return noContentResponse();
  } catch (error) {
    logger.error('Error deleting note', error);
    metrics.addMetric({ name: 'DeleteNoteErrors', value: 1 });

    return errorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    metrics.flush();
  }
};

