import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('GET /notes - Request received', JSON.stringify(event));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };

  try {
    // Get userId from Cognito authorizer
    const userId = event.requestContext?.authorizer?.claims?.sub;

    if (!userId) {
      console.log('ERROR: No userId found in request context');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    console.log('Querying notes for userId:', userId);

    const result = await docClient.send(new QueryCommand({
      TableName: NOTES_TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    const notes = result.Items || [];
    console.log(`SUCCESS: Retrieved ${notes.length} notes`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        notes,
        count: notes.length,
      }),
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



