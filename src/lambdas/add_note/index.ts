import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('POST /notes - Request received', JSON.stringify(event));

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

    const body = JSON.parse(event.body || '{}');
    const { title, content } = body;

    if (!title) {
      console.log('ERROR: Title is required');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title is required' }),
      };
    }

    const now = new Date().toISOString();
    const note = {
      userId,
      noteId: randomUUID(),
      title,
      content: content || '',
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating note:', note.noteId);

    await docClient.send(new PutCommand({
      TableName: NOTES_TABLE_NAME,
      Item: note,
    }));

    console.log('SUCCESS: Note created');

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ note }),
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




