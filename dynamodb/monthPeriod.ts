import * as AWS from 'aws-sdk';
import * as dynamodbUtils from './utils';
import { constants } from '../utils/constants'

export interface MonthPeriodMapping {
    month: string,
    startDate: string,
    endDate: string
}

export interface ListProps {
    month?: string
}

export class MonthPeriodRepository {

    private dynamoDbClient: AWS.DynamoDB;

    constructor() {
        this.dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants.AWS_REGION);
    }

    async query(props: ListProps): Promise<MonthPeriodMapping> {
        try {
            const queryParameters: AWS.DynamoDB.Types.QueryInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_MONTH_PERIOD]}`,
                KeyConditionExpression: "#month = :month",
                ExpressionAttributeNames: { "#month": "month" },
                ExpressionAttributeValues: { ":month": { "S": props.month } }
            };

            // Query the table
            const data = await this.dynamoDbClient.query(queryParameters).promise();

            // Map and return the result
            let monthPeriodList = this.mapResultList(data.Items);
            let response: MonthPeriodMapping  = monthPeriodList[0];

            return new Promise(resolve => resolve(response));

        } catch (exception) {
            // exception: AWS.AWSError
            console.error(exception);
            throw exception;
        }
    }

    async putItem(monthPeriod: MonthPeriodMapping): Promise<void> {
        try {

            const putItemParameters: AWS.DynamoDB.Types.PutItemInput = {
                TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_MONTH_PERIOD]}`,
                Item: {
                    "month": { "S" : monthPeriod.month },
                    "startDate": { "S": monthPeriod.startDate },
                    "endDate": { "S": monthPeriod.endDate }
                }
            };

            // Persist the item
            const data = await this.dynamoDbClient.putItem(putItemParameters).promise();
            return new Promise(resolve => resolve());

        } catch (exception) {
            // exception: AWS.AWSError
            console.error(exception);
            throw exception;
        }
    }

    private mapResultList(data?: AWS.DynamoDB.ItemList): Array<MonthPeriodMapping> {
        let monthPeriodList: Array<MonthPeriodMapping> = [];
        
        if (data && data.length > 0) {
            for (let i=0; i<data.length; i++) {
                monthPeriodList.push(this.mapResult(data[i]));
            }
        }

        return monthPeriodList;
    }

    private mapResult(item?: AWS.DynamoDB.AttributeMap) : MonthPeriodMapping {
        return {
            month: item?.month.S!,
            startDate: item?.startDate.S!,
            endDate: item?.endDate.S!
        };
    }

};