import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Import from Lambda layers
import { createLogger, createMetrics } from '/opt/nodejs';
import { createDynamoDBHelper } from '/opt/nodejs';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
} from '/opt/nodejs';

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;
const logger = createLogger();
const metrics = createMetrics();
const dynamoDB = createDynamoDBHelper(NOTES_TABLE_NAME);

interface NoteUpdateInput {
  title?: string;
  content?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();

  try {
    logger.info('Processing update note request', {
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
      return badRequestResponse('Missing noteId parameter');
    }

    // Parse request body
    if (!event.body) {
      logger.warn('Missing request body');
      return badRequestResponse('Missing request body');
    }

    const input: NoteUpdateInput = JSON.parse(event.body);

    // Validate at least one field is being updated
    if (!input.title && !input.content) {
      logger.warn('No fields to update');
      return badRequestResponse('At least one field (title or content) must be provided');
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

    // Build update expression
    const updateParts: string[] = [];
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': new Date().toISOString(),
    };
    const expressionAttributeNames: Record<string, string> = {};

    if (input.title) {
      updateParts.push('#title = :title');
      expressionAttributeValues[':title'] = input.title;
      expressionAttributeNames['#title'] = 'title';
    }

    if (input.content) {
      updateParts.push('#content = :content');
      expressionAttributeValues[':content'] = input.content;
      expressionAttributeNames['#content'] = 'content';
    }

    updateParts.push('updatedAt = :updatedAt');

    const updateExpression = `SET ${updateParts.join(', ')}`;

    // Update the note
    const updatedNote = await dynamoDB.update(
      { userId, noteId },
      updateExpression,
      expressionAttributeValues,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    );

    logger.info('Note updated successfully', { noteId });
    metrics.addMetric({ name: 'NotesUpdated', value: 1 });
    metrics.recordDuration('UpdateNoteDuration', startTime);

    return successResponse({
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    logger.error('Error updating note', error);
    metrics.addMetric({ name: 'UpdateNoteErrors', value: 1 });

    return errorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    metrics.flush();
  }
};

