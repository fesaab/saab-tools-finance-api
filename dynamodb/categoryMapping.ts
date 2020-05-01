import * as AWS from 'aws-sdk';
import * as dynamodbUtils from './utils';
import { constants } from '../utils/constants'

export interface CategoryMapping {
    description?: string,
    category?: string,
    regex?: boolean
}

export interface ListProps {
    description?: string
}

export interface CategoryMappingRepositoryListResponse {
    categoryMappingList: Array<CategoryMapping>,
    count: number,
    lastEvaluatedKey: string
}

export class CategoryMappingRepository {

    private dynamoDbClient: AWS.DynamoDB;

    constructor() {
        this.dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants.AWS_REGION);
    }

    async query(props: ListProps): Promise<CategoryMappingRepositoryListResponse> {
        try {
            const queryParameters: AWS.DynamoDB.Types.QueryInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_CATEGORY_MAPPING]}`,
                KeyConditionExpression: "#description = :description",
                ExpressionAttributeNames: { "#description": "description" },
                ExpressionAttributeValues: { ":description": { "S": props.description } }
            };

            // Query the table
            const data = await this.dynamoDbClient.query(queryParameters).promise();

            // Map and return the result
            let categoryMappingList = this.mapResultList(data.Items);
            let response: CategoryMappingRepositoryListResponse  = {
                categoryMappingList: categoryMappingList,
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

    async putItem(categoryMapping: CategoryMapping): Promise<CategoryMapping> {
        try {

            const putItemParameters: AWS.DynamoDB.Types.PutItemInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_CATEGORY_MAPPING]}`,
                Item: {
                    "description": { "S" : categoryMapping.description },
                    "category": { "S": categoryMapping.category },
                    "regex": { "BOOL": categoryMapping.regex }
                }
            };

            // Persist the item
            const data = await this.dynamoDbClient.putItem(putItemParameters).promise();

            // Map and return the result
            let categoryMappingPersisted = this.mapResult(data.Attributes);
            return new Promise(resolve => resolve(categoryMappingPersisted));

        } catch (exception) {
            // exception: AWS.AWSError
            console.error(exception);
            throw exception;
        }
    }

    private mapResultList(data?: AWS.DynamoDB.ItemList): Array<CategoryMapping> {
        let categoryMappingList: Array<CategoryMapping> = [];
        
        if (data && data.length > 0) {
            for (let i=0; i<data.length; i++) {
                categoryMappingList.push(this.mapResult(data[i]));
            }

            // Sort the result by date
            categoryMappingList.sort((a: any, b: any) => a.date - b.date);
        }

        return categoryMappingList;
    }

    private mapResult(item?: AWS.DynamoDB.AttributeMap) : CategoryMapping {
        return {
            description: item?.description.S,
            category: item?.category.S,
            regex: item?.regex.BOOL
        };
    }

};