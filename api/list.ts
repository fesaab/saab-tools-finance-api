import * as AWS from 'aws-sdk';
import * as dynamodbUtils from '../dynamodb/utils';
import { constants } from '../utils/constants'

exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));

    const dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants.AWS_REGION);

    const scanParameters: AWS.DynamoDB.Types.ScanInput = {
        "TableName": `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
        Limit: 10
    };

    let response: any = {};

    try {
        let transactionList: any[] = [];
        const data = await dynamoDbClient.scan(scanParameters).promise();
        data.Items?.forEach(function (item) {
            transactionList.push({
                id: item.id.S,
                value: item.value.N,
                type: item.type.S,
                date: Date.parse(item.date.S || ""),
                description: item.description.S,
                category: item.category.S,
                reversed: item.reversed.N,
                smsId: item.smsId.S
            });
        });

        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'transactions': transactionList,
                'count': data.Count,
                'lastEvaluatedKey': data.LastEvaluatedKey?.id.S
            })
          };
    } catch (e) {
        // e: AWS.AWSError
        console.error(e);
        response = {
            statusCode: 500,
            headers: {},
            body: JSON.stringify(e)
          };
    }

    console.log("Response: " + JSON.stringify(response));
    return response;
    
}

// process.env.transactionTableName = "Transactions";
// exports.handler({});