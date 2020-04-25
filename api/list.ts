import * as AWS from 'aws-sdk';
import * as dynamodbUtils from '../dynamodb/utils';
import { constants } from '../utils/constants'

exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));
    const dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants.AWS_REGION);

    // Base scan input
    const scanParameters: AWS.DynamoDB.Types.ScanInput = {
        TableName: `${process.env[constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
        Limit: 10
    };

    // In case the start / end date is set update the filer
    const startDate = event.queryStringParameters.startDate;
    const endDate = event.queryStringParameters.endDate;
    if (startDate || endDate) {

        console.log("Filtering using startDate=" + startDate + " and endDate=" + endDate);

        let filterExpression = "";
        let expressionAttributeValues: AWS.DynamoDB.ExpressionAttributeValueMap = {};
        let expressionAttributeNames: AWS.DynamoDB.ExpressionAttributeNameMap = {};

        if (startDate) {
            filterExpression = "#startDate >= :startDate";
            expressionAttributeNames["#startDate"] = "date";
            expressionAttributeValues[":startDate"] = { "S": startDate };
        }
        if (endDate) {
            if (filterExpression != "") {
                filterExpression += " and ";
            }

            filterExpression += "#endDate <= :endDate";
            expressionAttributeNames["#endDate"] = "date";
            expressionAttributeValues[":endDate"] = { "S": endDate };
        }

        scanParameters.FilterExpression = filterExpression;
        scanParameters.ExpressionAttributeNames = expressionAttributeNames;
        scanParameters.ExpressionAttributeValues = expressionAttributeValues;
        delete scanParameters.Limit; // Return everything!
    } 

    let response: any = {};

    try {
        let transactionList: any[] = [];

        // Scan the table
        const data = await dynamoDbClient.scan(scanParameters).promise();

        // Map the DynamoDB response to the response list
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

        // Sort the result by date
        if (transactionList.length > 1)
            transactionList.sort((a: any, b: any) => a.date - b.date);

        // Response object
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
// exports.handler({
//     "resource": "/transactions",
//     "path": "/transactions",
//     "httpMethod": "GET",
//     "headers": {
//         "Accept": "*/*",
//         "Authorization": "Basic 123456",
//         "CloudFront-Forwarded-Proto": "https",
//         "CloudFront-Is-Desktop-Viewer": "true",
//         "CloudFront-Is-Mobile-Viewer": "false",
//         "CloudFront-Is-SmartTV-Viewer": "false",
//         "CloudFront-Is-Tablet-Viewer": "false",
//         "CloudFront-Viewer-Country": "US",
//         "Host": "4wb3lnovo8.execute-api.us-east-1.amazonaws.com",
//         "User-Agent": "curl/7.58.0",
//         "Via": "2.0 aa7679f2d01b23d9a66bfa6e92991b05.cloudfront.net (CloudFront)",
//         "X-Amz-Cf-Id": "lkw-Ko1-7RT2vuR-mMlEkrc7Eg9gPOzfi-bspYyTNJpQ4qXSDdPaCQ==",
//         "X-Amzn-Trace-Id": "Root=1-5ea40a1d-ca1b3ec09bb9143089b70af0",
//         "X-Forwarded-For": "217.138.208.166, 130.176.29.71",
//         "X-Forwarded-Port": "443",
//         "X-Forwarded-Proto": "https"
//     },
//     "multiValueHeaders": {
//         "Accept": [
//             "*/*"
//         ],
//         "Authorization": [
//             "Basic 123456"
//         ],
//         "CloudFront-Forwarded-Proto": [
//             "https"
//         ],
//         "CloudFront-Is-Desktop-Viewer": [
//             "true"
//         ],
//         "CloudFront-Is-Mobile-Viewer": [
//             "false"
//         ],
//         "CloudFront-Is-SmartTV-Viewer": [
//             "false"
//         ],
//         "CloudFront-Is-Tablet-Viewer": [
//             "false"
//         ],
//         "CloudFront-Viewer-Country": [
//             "US"
//         ],
//         "Host": [
//             "4wb3lnovo8.execute-api.us-east-1.amazonaws.com"
//         ],
//         "User-Agent": [
//             "curl/7.58.0"
//         ],
//         "Via": [
//             "2.0 aa7679f2d01b23d9a66bfa6e92991b05.cloudfront.net (CloudFront)"
//         ],
//         "X-Amz-Cf-Id": [
//             "lkw-Ko1-7RT2vuR-mMlEkrc7Eg9gPOzfi-bspYyTNJpQ4qXSDdPaCQ=="
//         ],
//         "X-Amzn-Trace-Id": [
//             "Root=1-5ea40a1d-ca1b3ec09bb9143089b70af0"
//         ],
//         "X-Forwarded-For": [
//             "217.138.208.166, 130.176.29.71"
//         ],
//         "X-Forwarded-Port": [
//             "443"
//         ],
//         "X-Forwarded-Proto": [
//             "https"
//         ]
//     },
//     "queryStringParameters": {
//         "startDate": "2020-04-01",
//         "endDate": "2020-04-15"
//     },
//     "multiValueQueryStringParameters": {
//         "startDate": [
//             "2020-04-01?teste=1234"
//         ]
//     },
//     "pathParameters": null,
//     "stageVariables": null,
//     "requestContext": {
//         "resourceId": "dm595m",
//         "authorizer": {
//             "principalId": "me",
//             "integrationLatency": 0
//         },
//         "resourcePath": "/transactions",
//         "httpMethod": "GET",
//         "extendedRequestId": "LiaEkHIfoAMFnMQ=",
//         "requestTime": "25/Apr/2020:09:59:57 +0000",
//         "path": "/prod/transactions",
//         "accountId": "689243596060",
//         "protocol": "HTTP/1.1",
//         "stage": "prod",
//         "domainPrefix": "4wb3lnovo8",
//         "requestTimeEpoch": 1587808797172,
//         "requestId": "c0653d32-0847-42f2-beac-bfe0c9d37388",
//         "identity": {
//             "cognitoIdentityPoolId": null,
//             "accountId": null,
//             "cognitoIdentityId": null,
//             "caller": null,
//             "sourceIp": "217.138.208.166",
//             "principalOrgId": null,
//             "accessKey": null,
//             "cognitoAuthenticationType": null,
//             "cognitoAuthenticationProvider": null,
//             "userArn": null,
//             "userAgent": "curl/7.58.0",
//             "user": null
//         },
//         "domainName": "4wb3lnovo8.execute-api.us-east-1.amazonaws.com",
//         "apiId": "4wb3lnovo8"
//     },
//     "body": null,
//     "isBase64Encoded": false
// });