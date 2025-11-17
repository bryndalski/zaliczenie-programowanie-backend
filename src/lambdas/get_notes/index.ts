import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Import from Lambda layers
import { createLogger, createMetrics } from '/opt/nodejs';
import { createDynamoDBHelper } from '/opt/nodejs';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
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
    logger.info('Processing get notes request', {
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

    // Query notes for the user
    const notes = await dynamoDB.query(
      'userId = :userId',
      { ':userId': userId }
    );

    logger.info('Notes retrieved successfully', { count: notes.length });
    metrics.addMetric({ name: 'NotesRetrieved', value: notes.length });
    metrics.recordDuration('GetNotesDuration', startTime);

    return successResponse({
      notes,
      count: notes.length,
    });
  } catch (error) {
    logger.error('Error retrieving notes', error);
    metrics.addMetric({ name: 'GetNotesErrors', value: 1 });

    return errorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    metrics.flush();
  }
};

