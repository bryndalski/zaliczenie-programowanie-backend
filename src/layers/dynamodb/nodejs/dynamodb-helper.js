"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamoDBHelper = exports.DynamoDBHelper = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const dynamoDB = lib_dynamodb_1.DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
});
class DynamoDBHelper {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async put(item) {
        const params = {
            TableName: this.tableName,
            Item: item,
        };
        await dynamoDB.send(new lib_dynamodb_1.PutCommand(params));
    }
    async get(key) {
        const params = {
            TableName: this.tableName,
            Key: key,
        };
        const result = await dynamoDB.send(new lib_dynamodb_1.GetCommand(params));
        return result.Item || null;
    }
    async query(keyConditionExpression, expressionAttributeValues, expressionAttributeNames, indexName) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
            ...(indexName && { IndexName: indexName }),
        };
        const result = await dynamoDB.send(new lib_dynamodb_1.QueryCommand(params));
        return result.Items || [];
    }
    async update(key, updateExpression, expressionAttributeValues, expressionAttributeNames) {
        const params = {
            TableName: this.tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
            ReturnValues: 'ALL_NEW',
        };
        const result = await dynamoDB.send(new lib_dynamodb_1.UpdateCommand(params));
        return result.Attributes || {};
    }
    async delete(key) {
        const params = {
            TableName: this.tableName,
            Key: key,
        };
        await dynamoDB.send(new lib_dynamodb_1.DeleteCommand(params));
    }
    async scan(filterExpression, expressionAttributeValues, expressionAttributeNames) {
        const params = {
            TableName: this.tableName,
            ...(filterExpression && { FilterExpression: filterExpression }),
            ...(expressionAttributeValues && { ExpressionAttributeValues: expressionAttributeValues }),
            ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
        };
        const result = await dynamoDB.send(new lib_dynamodb_1.ScanCommand(params));
        return result.Items || [];
    }
    async batchGet(keys) {
        // DynamoDB BatchGetItem has a limit of 100 items
        const chunks = this.chunkArray(keys, 100);
        const results = [];
        for (const chunk of chunks) {
            const params = {
                RequestItems: {
                    [this.tableName]: {
                        Keys: chunk,
                    },
                },
            };
            const result = await dynamoDB.send(new lib_dynamodb_1.QueryCommand(params));
            if (result.Items) {
                results.push(...result.Items);
            }
        }
        return results;
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
exports.DynamoDBHelper = DynamoDBHelper;
const createDynamoDBHelper = (tableName) => new DynamoDBHelper(tableName);
exports.createDynamoDBHelper = createDynamoDBHelper;
