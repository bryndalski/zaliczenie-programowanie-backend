import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('DELETE /notes/{noteId} - Request received', JSON.stringify(event));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };

  try {
    const userId = event.requestContext?.authorizer?.claims?.sub;

    if (!userId) {
      console.log('ERROR: No userId found in request context');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const noteId = event.pathParameters?.noteId;

    if (!noteId) {
      console.log('ERROR: Missing noteId parameter');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing noteId parameter' }),
      };
    }

    console.log('Fetching note:', noteId);

    const getResult = await docClient.send(new GetCommand({
      TableName: NOTES_TABLE_NAME,
      Key: { userId, noteId },
    }));

    if (!getResult.Item) {
      console.log('ERROR: Note not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Note not found' }),
      };
    }

    console.log('Deleting note:', noteId);

    await docClient.send(new DeleteCommand({
      TableName: NOTES_TABLE_NAME,
      Key: { userId, noteId },
    }));

    console.log('SUCCESS: Note deleted');

    return {
      statusCode: 204,
      headers,
      body: '',
    };
  } catch (error) {
    console.error('ERROR:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};




