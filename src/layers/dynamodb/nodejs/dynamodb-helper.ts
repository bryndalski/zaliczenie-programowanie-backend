import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export interface DbItem {
  [key: string]: any;
}

export class DynamoDBHelper {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async put(item: DbItem): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: item,
    };

    await dynamoDB.send(new PutCommand(params));
  }

  async get(key: DbItem): Promise<DbItem | null> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: key,
    };

    const result = await dynamoDB.send(new GetCommand(params));
    return result.Item || null;
  }

  async query(
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>,
    indexName?: string
  ): Promise<DbItem[]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
      ...(indexName && { IndexName: indexName }),
    };

    const result = await dynamoDB.send(new QueryCommand(params));
    return result.Items || [];
  }

  async update(
    key: DbItem,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<DbItem> {
    const params: UpdateCommandInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDB.send(new UpdateCommand(params));
    return result.Attributes || {};
  }

  async delete(key: DbItem): Promise<void> {
    const params: DeleteCommandInput = {
      TableName: this.tableName,
      Key: key,
    };

    await dynamoDB.send(new DeleteCommand(params));
  }

  async scan(
    filterExpression?: string,
    expressionAttributeValues?: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<DbItem[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      ...(filterExpression && { FilterExpression: filterExpression }),
      ...(expressionAttributeValues && { ExpressionAttributeValues: expressionAttributeValues }),
      ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
    };

    const result = await dynamoDB.send(new ScanCommand(params));
    return result.Items || [];
  }

  async batchGet(keys: DbItem[]): Promise<DbItem[]> {
    // DynamoDB BatchGetItem has a limit of 100 items
    const chunks = this.chunkArray(keys, 100);
    const results: DbItem[] = [];

    for (const chunk of chunks) {
      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: chunk,
          },
        },
      };

      const result = await dynamoDB.send(new QueryCommand(params as any));
      if (result.Items) {
        results.push(...result.Items);
      }
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const createDynamoDBHelper = (tableName: string) => new DynamoDBHelper(tableName);

