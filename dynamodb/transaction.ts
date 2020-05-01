import * as AWS from 'aws-sdk';
import * as dynamodbUtils from './utils';
import { constants } from '../utils/constants'

export interface Transaction {
    id?: string,
    value?: number,
    type?: string,
    date?: number,
    description?: string,
    category?: string,
    reversed?: boolean,
    smsId?: string
}

export interface ListProps {
    startDate?: string,
    endDate?: string
}

export interface QueryProps {
    id: string
}

export interface TransactionRepositoryListResponse {
    transactionList: Array<Transaction>,
    count: number,
    lastEvaluatedKey: string
}

export class TransactionRepository {

    private dynamoDbClient: AWS.DynamoDB;

    constructor() {
        this.dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants.AWS_REGION);
    }

    async list(props: ListProps): Promise<TransactionRepositoryListResponse> {
        try {
            // If it is a search without parameter it is paginates
            const scanParameters: AWS.DynamoDB.Types.ScanInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
                Limit: 10
            };

            // Update the query with the filter properties
            if (props.startDate || props.endDate) {
                let filterExpression = "";
                let expressionAttributeValues: AWS.DynamoDB.ExpressionAttributeValueMap = {};
                let expressionAttributeNames: AWS.DynamoDB.ExpressionAttributeNameMap = {};

                
                if (props.startDate) {
                    filterExpression = "#startDate >= :startDate";
                    expressionAttributeNames["#startDate"] = "date";
                    expressionAttributeValues[":startDate"] = { "S": props.startDate };
                }
                if (props.endDate) {
                    if (filterExpression != "") {
                        filterExpression += " and ";
                    }

                    filterExpression += "#endDate <= :endDate";
                    expressionAttributeNames["#endDate"] = "date";
                    expressionAttributeValues[":endDate"] = { "S": props.endDate };
                }

                scanParameters.FilterExpression = filterExpression;
                scanParameters.ExpressionAttributeNames = expressionAttributeNames;
                scanParameters.ExpressionAttributeValues = expressionAttributeValues;
                delete scanParameters.Limit; // Return everything!
            }

            // Scan the table
            const data = await this.dynamoDbClient.scan(scanParameters).promise();

            // Map and return the result
            let transactionList = this.mapTransactionResult(data.Items);
            let response: TransactionRepositoryListResponse  = {
                transactionList: transactionList,
                count: data.Count || 0,
                lastEvaluatedKey: data.LastEvaluatedKey?.id.S || ''
            };

            return new Promise(resolve => resolve(response));

        } catch (exception) {
            // exception: AWS.AWSError
            return new Promise(rejects => rejects(exception));
        }
    }

    async query(props: QueryProps): Promise<TransactionRepositoryListResponse> {
        try {
            const queryParameters: AWS.DynamoDB.Types.QueryInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeNames: { "#id": "id" },
                ExpressionAttributeValues: { ":id": { "S": props.id } }
            };

            // Query the table
            const data = await this.dynamoDbClient.query(queryParameters).promise();

            // Map and return the result
            let transactionList = this.mapTransactionResult(data.Items);
            let response: TransactionRepositoryListResponse = {
                transactionList: transactionList,
                count: data.Count || 0,
                lastEvaluatedKey: data.LastEvaluatedKey?.id.S || ''
            };

            return new Promise(resolve => resolve(response));

        } catch (exception) {
            // exception: AWS.AWSError
            console.error(exception);
            throw exception;
        }
    }

    async updateCategory(transaction: Transaction): Promise<Transaction> {
        try {

            const updateItemParameters: AWS.DynamoDB.Types.UpdateItemInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
                Key: {
                    "id": { "S" : transaction.id }
                },
                UpdateExpression: "SET #category = :category",
                ExpressionAttributeNames: { "#category": "category" },
                ExpressionAttributeValues: { ":category": { "S": transaction.category } }
            };

            // Persist the item
            const data = await this.dynamoDbClient.updateItem(updateItemParameters).promise();

            // Map and return the result
            let categoryMappingPersisted = this.mapTransaction(data.Attributes);
            return new Promise(resolve => resolve(categoryMappingPersisted));

        } catch (exception) {
            // exception: AWS.AWSError
            console.error(exception);
            throw exception;
        }
    }

    private mapTransactionResult(data?: AWS.DynamoDB.ItemList): Array<Transaction> {
        let transactionList: Array<Transaction> = [];
        
        if (data && data.length > 0) {
            for (let i=0; i<data.length; i++) {
                transactionList.push(this.mapTransaction(data[i]));
            }
            
            // Sort the result by date
            transactionList.sort((a: any, b: any) => a.date - b.date);
        }

        return transactionList;
    }

    private mapTransaction(item?: AWS.DynamoDB.AttributeMap): Transaction {
        return {
            id: item?.id.S,
            value: Number.parseFloat(item?.value.N || "-1"),
            type: item?.type.S,
            date: Date.parse(item?.date.S || ""),
            description: item?.description.S,
            category: item?.category.S,
            reversed: item?.reversed.BOOL,
            smsId: item?.smsId.S
        };
    }

};