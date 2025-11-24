export interface DbItem {
    [key: string]: any;
}
export declare class DynamoDBHelper {
    private tableName;
    constructor(tableName: string);
    put(item: DbItem): Promise<void>;
    get(key: DbItem): Promise<DbItem | null>;
    query(keyConditionExpression: string, expressionAttributeValues: Record<string, any>, expressionAttributeNames?: Record<string, string>, indexName?: string): Promise<DbItem[]>;
    update(key: DbItem, updateExpression: string, expressionAttributeValues: Record<string, any>, expressionAttributeNames?: Record<string, string>): Promise<DbItem>;
    delete(key: DbItem): Promise<void>;
    scan(filterExpression?: string, expressionAttributeValues?: Record<string, any>, expressionAttributeNames?: Record<string, string>): Promise<DbItem[]>;
    batchGet(keys: DbItem[]): Promise<DbItem[]>;
    private chunkArray;
}
export declare const createDynamoDBHelper: (tableName: string) => DynamoDBHelper;
