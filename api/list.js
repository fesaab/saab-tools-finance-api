"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodbUtils = require("../dynamodb/utils");
const constants_1 = require("../utils/constants");
exports.handler = async (event = {}) => {
    var _a, _b;
    console.log("About to process request: " + JSON.stringify(event));
    const dynamoDbClient = dynamodbUtils.createDynamoDbClient(constants_1.constants.AWS_REGION);
    // Base scan input
    const scanParameters = {
        TableName: `${process.env[constants_1.constants.ENV_VAR_DYNAMODB_TABLE_TRANSACTIONS]}`,
        Limit: 10
    };
    // In case the start / end date is set update the filer
    const startDate = event.queryStringParameters.startDate;
    const endDate = event.queryStringParameters.endDate;
    if (startDate || endDate) {
        console.log("Filtering using startDate=" + startDate + " and endDate=" + endDate);
        let filterExpression = "";
        let expressionAttributeValues = {};
        let expressionAttributeNames = {};
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
    let response = {};
    try {
        let transactionList = [];
        // Scan the table
        const data = await dynamoDbClient.scan(scanParameters).promise();
        // Map the DynamoDB response to the response list
        (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
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
            transactionList.sort((a, b) => a.date - b.date);
        // Response object
        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'transactions': transactionList,
                'count': data.Count,
                'lastEvaluatedKey': (_b = data.LastEvaluatedKey) === null || _b === void 0 ? void 0 : _b.id.S
            })
        };
    }
    catch (e) {
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
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtREFBbUQ7QUFDbkQsa0RBQThDO0FBRTlDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLFFBQWEsRUFBRSxFQUFFLEVBQUU7O0lBRXhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWhGLGtCQUFrQjtJQUNsQixNQUFNLGNBQWMsR0FBaUM7UUFDakQsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBUyxDQUFDLG1DQUFtQyxDQUFDLEVBQUU7UUFDMUUsS0FBSyxFQUFFLEVBQUU7S0FDWixDQUFDO0lBRUYsdURBQXVEO0lBQ3ZELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7SUFDeEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQztJQUNwRCxJQUFJLFNBQVMsSUFBSSxPQUFPLEVBQUU7UUFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxTQUFTLEdBQUcsZUFBZSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRWxGLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUkseUJBQXlCLEdBQTZDLEVBQUUsQ0FBQztRQUM3RSxJQUFJLHdCQUF3QixHQUE0QyxFQUFFLENBQUM7UUFFM0UsSUFBSSxTQUFTLEVBQUU7WUFDWCxnQkFBZ0IsR0FBRywwQkFBMEIsQ0FBQztZQUM5Qyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDaEQseUJBQXlCLENBQUMsWUFBWSxDQUFD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LFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUNsQyxTQUFTO0FBQ1QsMkNBQTJDO0FBQzNDLHlCQUF5QjtBQUN6QixzQ0FBc0M7QUFDdEMsWUFBWTtBQUNaLFNBQVM7QUFDVCw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLDBCQUEwQjtBQUMxQixrQ0FBa0M7QUFDbEMsMEJBQTBCO0FBQzFCLG1DQUFtQztBQUNuQyxzQ0FBc0M7QUFDdEMsYUFBYTtBQUNiLDJDQUEyQztBQUMzQywrQkFBK0I7QUFDL0IsbURBQW1EO0FBQ25ELHVEQUF1RDtBQUN2RCx3Q0FBd0M7QUFDeEMsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUNsQywyQkFBMkI7QUFDM0Isd0NBQXdDO0FBQ3hDLDZDQUE2QztBQUM3QywrREFBK0Q7QUFDL0Qsd0JBQXdCO0FBQ3hCLDZDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMseUNBQXlDO0FBQ3pDLDhCQUE4QjtBQUM5Qiw2Q0FBNkM7QUFDN0Msc0NBQXNDO0FBQ3RDLGlDQUFpQztBQUNqQyxpREFBaUQ7QUFDakQscURBQXFEO0FBQ3JELCtCQUErQjtBQUMvQiwwQ0FBMEM7QUFDMUMsMkJBQTJCO0FBQzNCLGFBQWE7QUFDYiwwRUFBMEU7QUFDMUUsZ0NBQWdDO0FBQ2hDLFNBQVM7QUFDVCxvQkFBb0I7QUFDcEIsK0JBQStCO0FBQy9CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XHJcbmltcG9ydCAqIGFzIGR5bmFtb2RiVXRpbHMgZnJvbSAnLi4vZHluYW1vZGIvdXRpbHMnO1xyXG5pbXBvcnQgeyBjb25zdGFudHMgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnXHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSA9IHt9KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJBYm91dCB0byBwcm9jZXNzIHJlcXVlc3Q6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcclxuICAgIGNvbnN0IGR5bmFtb0RiQ2xpZW50ID0gZHluYW1vZGJVdGlscy5jcmVhdGVEeW5hbW9EYkNsaWVudChjb25zdGFudHMuQVdTX1JFR0lPTik7XHJcblxyXG4gICAgLy8gQmFzZSBzY2FuIGlucHV0XHJcbiAgICBjb25zdCBzY2FuUGFyYW1ldGVyczogQVdTLkR5bmFtb0RCLlR5cGVzLlNjYW5JbnB1dCA9IHtcclxuICAgICAgICBUYWJsZU5hbWU6IGAke3Byb2Nlc3MuZW52W2NvbnN0YW50cy5FTlZfVkFSX0RZTkFNT0RCX1RBQkxFX1RSQU5TQUNUSU9OU119YCxcclxuICAgICAgICBMaW1pdDogMTBcclxuICAgIH07XHJcblxyXG4gICAgLy8gSW4gY2FzZSB0aGUgc3RhcnQgLyBlbmQgZGF0ZSBpcyBzZXQgdXBkYXRlIHRoZSBmaWxlclxyXG4gICAgY29uc3Qgc3RhcnREYXRlID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzLnN0YXJ0RGF0ZTtcclxuICAgIGNvbnN0IGVuZERhdGUgPSBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnMuZW5kRGF0ZTtcclxuICAgIGlmIChzdGFydERhdGUgfHwgZW5kRGF0ZSkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkZpbHRlcmluZyB1c2luZyBzdGFydERhdGU9XCIgKyBzdGFydERhdGUgKyBcIiBhbmQgZW5kRGF0ZT1cIiArIGVuZERhdGUpO1xyXG5cclxuICAgICAgICBsZXQgZmlsdGVyRXhwcmVzc2lvbiA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IEFXUy5EeW5hbW9EQi5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVNYXAgPSB7fTtcclxuICAgICAgICBsZXQgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiBBV1MuRHluYW1vREIuRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSkge1xyXG4gICAgICAgICAgICBmaWx0ZXJFeHByZXNzaW9uID0gXCIjc3RhcnREYXRlID49IDpzdGFydERhdGVcIjtcclxuICAgICAgICAgICAgZXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzW1wiI3N0YXJ0RGF0ZVwiXSA9IFwiZGF0ZVwiO1xyXG4gICAgICAgICAgICBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzW1wiOnN0YXJ0RGF0ZVwiXSA9IHsgXCJTXCI6IHN0YXJ0RGF0ZSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRXhwcmVzc2lvbiAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJFeHByZXNzaW9uICs9IFwiIGFuZCBcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsdGVyRXhwcmVzc2lvbiArPSBcIiNlbmREYXRlIDw9IDplbmREYXRlXCI7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lc1tcIiNlbmREYXRlXCJdID0gXCJkYXRlXCI7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNbXCI6ZW5kRGF0ZVwiXSA9IHsgXCJTXCI6IGVuZERhdGUgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjYW5QYXJhbWV0ZXJzLkZpbHRlckV4cHJlc3Npb24gPSBmaWx0ZXJFeHByZXNzaW9uO1xyXG4gICAgICAgIHNjYW5QYXJhbWV0ZXJzLkV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lcyA9IGV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lcztcclxuICAgICAgICBzY2FuUGFyYW1ldGVycy5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzID0gZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcztcclxuICAgICAgICBkZWxldGUgc2NhblBhcmFtZXRlcnMuTGltaXQ7IC8vIFJldHVybiBldmVyeXRoaW5nIVxyXG4gICAgfSBcclxuXHJcbiAgICBsZXQgcmVzcG9uc2U6IGFueSA9IHt9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHRyYW5zYWN0aW9uTGlzdDogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgLy8gU2NhbiB0aGUgdGFibGVcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZHluYW1vRGJDbGllbnQuc2NhbihzY2FuUGFyYW1ldGVycykucHJvbWlzZSgpO1xyXG5cclxuICAgICAgICAvLyBNYXAgdGhlIER5bmFtb0RCIHJlc3BvbnNlIHRvIHRoZSByZXNwb25zZSBsaXN0XHJcbiAgICAgICAgZGF0YS5JdGVtcz8uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbkxpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaXRlbS5pZC5TLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0udmFsdWUuTixcclxuICAgICAgICAgICAgICAgIHR5cGU6IGl0ZW0udHlwZS5TLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTogRGF0ZS5wYXJzZShpdGVtLmRhdGUuUyB8fCBcIlwiKSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLmRlc2NyaXB0aW9uLlMsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogaXRlbS5jYXRlZ29yeS5TLFxyXG4gICAgICAgICAgICAgICAgcmV2ZXJzZWQ6IGl0ZW0ucmV2ZXJzZWQuTixcclxuICAgICAgICAgICAgICAgIHNtc0lkOiBpdGVtLnNtc0lkLlNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNvcnQgdGhlIHJlc3VsdCBieSBkYXRlXHJcbiAgICAgICAgaWYgKHRyYW5zYWN0aW9uTGlzdC5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbkxpc3Quc29ydCgoYTogYW55LCBiOiBhbnkpID0+IGEuZGF0ZSAtIGIuZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIFJlc3BvbnNlIG9iamVjdFxyXG4gICAgICAgIHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucyc6IHRyYW5zYWN0aW9uTGlzdCxcclxuICAgICAgICAgICAgICAgICdjb3VudCc6IGRhdGEuQ291bnQsXHJcbiAgICAgICAgICAgICAgICAnbGFzdEV2YWx1YXRlZEtleSc6IGRhdGEuTGFzdEV2YWx1YXRlZEtleT8uaWQuU1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gZTogQVdTLkFXU0Vycm9yXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICByZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2U6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbn1cclxuXHJcbi8vIHByb2Nlc3MuZW52LnRyYW5zYWN0aW9uVGFibGVOYW1lID0gXCJUcmFuc2FjdGlvbnNcIjtcclxuLy8gZXhwb3J0cy5oYW5kbGVyKHtcclxuLy8gICAgIFwicmVzb3VyY2VcIjogXCIvdHJhbnNhY3Rpb25zXCIsXHJcbi8vICAgICBcInBhdGhcIjogXCIvdHJhbnNhY3Rpb25zXCIsXHJcbi8vICAgICBcImh0dHBNZXRob2RcIjogXCJHRVRcIixcclxuLy8gICAgIFwiaGVhZGVyc1wiOiB7XHJcbi8vICAgICAgICAgXCJBY2NlcHRcIjogXCIqLypcIixcclxuLy8gICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyAxMjM0NTZcIixcclxuLy8gICAgICAgICBcIkNsb3VkRnJvbnQtRm9yd2FyZGVkLVByb3RvXCI6IFwiaHR0cHNcIixcclxuLy8gICAgICAgICBcIkNsb3VkRnJvbnQtSXMtRGVza3RvcC1WaWV3ZXJcIjogXCJ0cnVlXCIsXHJcbi8vICAgICAgICAgXCJDbG91ZEZyb250LUlzLU1vYmlsZS1WaWV3ZXJcIjogXCJmYWxzZVwiLFxyXG4vLyAgICAgICAgIFwiQ2xvdWRGcm9udC1Jcy1TbWFydFRWLVZpZXdlclwiOiBcImZhbHNlXCIsXHJcbi8vICAgICAgICAgXCJDbG91ZEZyb250LUlzLVRhYmxldC1WaWV3ZXJcIjogXCJmYWxzZVwiLFxyXG4vLyAgICAgICAgIFwiQ2xvdWRGcm9udC1WaWV3ZXItQ291bnRyeVwiOiBcIlVTXCIsXHJcbi8vICAgICAgICAgXCJIb3N0XCI6IFwiNHdiM2xub3ZvOC5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwiLFxyXG4vLyAgICAgICAgIFwiVXNlci1BZ2VudFwiOiBcImN1cmwvNy41OC4wXCIsXHJcbi8vICAgICAgICAgXCJWaWFcIjogXCIyLjAgYWE3Njc5ZjJkMDFiMjNkOWE2NmJmYTZlOTI5OTFiMDUuY2xvdWRmcm9udC5uZXQgKENsb3VkRnJvbnQpXCIsXHJcbi8vICAgICAgICAgXCJYLUFtei1DZi1JZFwiOiBcImxrdy1LbzEtN1JUMnZ1Ui1tTWxFa3JjN0VnOWdQT3pmaS1ic3BZeVROSnBRNHFYU0RkUGFDUT09XCIsXHJcbi8vICAgICAgICAgXCJYLUFtem4tVHJhY2UtSWRcIjogXCJSb290PTEtNWVhNDBhMWQtY2ExYjNlYzA5YmI5MTQzMDg5YjcwYWYwXCIsXHJcbi8vICAgICAgICAgXCJYLUZvcndhcmRlZC1Gb3JcIjogXCIyMTcuMTM4LjIwOC4xNjYsIDEzMC4xNzYuMjkuNzFcIixcclxuLy8gICAgICAgICBcIlgtRm9yd2FyZGVkLVBvcnRcIjogXCI0NDNcIixcclxuLy8gICAgICAgICBcIlgtRm9yd2FyZGVkLVByb3RvXCI6IFwiaHR0cHNcIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIFwibXVsdGlWYWx1ZUhlYWRlcnNcIjoge1xyXG4vLyAgICAgICAgIFwiQWNjZXB0XCI6IFtcclxuLy8gICAgICAgICAgICAgXCIqLypcIlxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFtcclxuLy8gICAgICAgICAgICAgXCJCYXNpYyAxMjM0NTZcIlxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgXCJDbG91ZEZyb250LUZvcndhcmRlZC1Qcm90b1wiOiBbXHJcbi8vICAgICAgICAgICAgIFwiaHR0cHNcIlxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgXCJDbG91ZEZyb250LUlzLURlc2t0b3AtVmlld2VyXCI6IFtcclxuLy8gICAgICAgICAgICAgXCJ0cnVlXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiQ2xvdWRGcm9udC1Jcy1Nb2JpbGUtVmlld2VyXCI6IFtcclxuLy8gICAgICAgICAgICAgXCJmYWxzZVwiXHJcbi8vICAgICAgICAgXSxcclxuLy8gICAgICAgICBcIkNsb3VkRnJvbnQtSXMtU21hcnRUVi1WaWV3ZXJcIjogW1xyXG4vLyAgICAgICAgICAgICBcImZhbHNlXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiQ2xvdWRGcm9udC1Jcy1UYWJsZXQtVmlld2VyXCI6IFtcclxuLy8gICAgICAgICAgICAgXCJmYWxzZVwiXHJcbi8vICAgICAgICAgXSxcclxuLy8gICAgICAgICBcIkNsb3VkRnJvbnQtVmlld2VyLUNvdW50cnlcIjogW1xyXG4vLyAgICAgICAgICAgICBcIlVTXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiSG9zdFwiOiBbXHJcbi8vICAgICAgICAgICAgIFwiNHdiM2xub3ZvOC5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwiXHJcbi8vICAgICAgICAgXSxcclxuLy8gICAgICAgICBcIlVzZXItQWdlbnRcIjogW1xyXG4vLyAgICAgICAgICAgICBcImN1cmwvNy41OC4wXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiVmlhXCI6IFtcclxuLy8gICAgICAgICAgICAgXCIyLjAgYWE3Njc5ZjJkMDFiMjNkOWE2NmJmYTZlOTI5OTFiMDUuY2xvdWRmcm9udC5uZXQgKENsb3VkRnJvbnQpXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiWC1BbXotQ2YtSWRcIjogW1xyXG4vLyAgICAgICAgICAgICBcImxrdy1LbzEtN1JUMnZ1Ui1tTWxFa3JjN0VnOWdQT3pmaS1ic3BZeVROSnBRNHFYU0RkUGFDUT09XCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiWC1BbXpuLVRyYWNlLUlkXCI6IFtcclxuLy8gICAgICAgICAgICAgXCJSb290PTEtNWVhNDBhMWQtY2ExYjNlYzA5YmI5MTQzMDg5YjcwYWYwXCJcclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIFwiWC1Gb3J3YXJkZWQtRm9yXCI6IFtcclxuLy8gICAgICAgICAgICAgXCIyMTcuMTM4LjIwOC4xNjYsIDEzMC4xNzYuMjkuNzFcIlxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgXCJYLUZvcndhcmRlZC1Qb3J0XCI6IFtcclxuLy8gICAgICAgICAgICAgXCI0NDNcIlxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgXCJYLUZvcndhcmRlZC1Qcm90b1wiOiBbXHJcbi8vICAgICAgICAgICAgIFwiaHR0cHNcIlxyXG4vLyAgICAgICAgIF1cclxuLy8gICAgIH0sXHJcbi8vICAgICBcInF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1wiOiB7XHJcbi8vICAgICAgICAgXCJzdGFydERhdGVcIjogXCIyMDIwLTA0LTAxXCIsXHJcbi8vICAgICAgICAgXCJlbmREYXRlXCI6IFwiMjAyMC0wNC0xNVwiXHJcbi8vICAgICB9LFxyXG4vLyAgICAgXCJtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzXCI6IHtcclxuLy8gICAgICAgICBcInN0YXJ0RGF0ZVwiOiBbXHJcbi8vICAgICAgICAgICAgIFwiMjAyMC0wNC0wMT90ZXN0ZT0xMjM0XCJcclxuLy8gICAgICAgICBdXHJcbi8vICAgICB9LFxyXG4vLyAgICAgXCJwYXRoUGFyYW1ldGVyc1wiOiBudWxsLFxyXG4vLyAgICAgXCJzdGFnZVZhcmlhYmxlc1wiOiBudWxsLFxyXG4vLyAgICAgXCJyZXF1ZXN0Q29udGV4dFwiOiB7XHJcbi8vICAgICAgICAgXCJyZXNvdXJjZUlkXCI6IFwiZG01OTVtXCIsXHJcbi8vICAgICAgICAgXCJhdXRob3JpemVyXCI6IHtcclxuLy8gICAgICAgICAgICAgXCJwcmluY2lwYWxJZFwiOiBcIm1lXCIsXHJcbi8vICAgICAgICAgICAgIFwiaW50ZWdyYXRpb25MYXRlbmN5XCI6IDBcclxuLy8gICAgICAgICB9LFxyXG4vLyAgICAgICAgIFwicmVzb3VyY2VQYXRoXCI6IFwiL3RyYW5zYWN0aW9uc1wiLFxyXG4vLyAgICAgICAgIFwiaHR0cE1ldGhvZFwiOiBcIkdFVFwiLFxyXG4vLyAgICAgICAgIFwiZXh0ZW5kZWRSZXF1ZXN0SWRcIjogXCJMaWFFa0hJZm9BTUZuTVE9XCIsXHJcbi8vICAgICAgICAgXCJyZXF1ZXN0VGltZVwiOiBcIjI1L0Fwci8yMDIwOjA5OjU5OjU3ICswMDAwXCIsXHJcbi8vICAgICAgICAgXCJwYXRoXCI6IFwiL3Byb2QvdHJhbnNhY3Rpb25zXCIsXHJcbi8vICAgICAgICAgXCJhY2NvdW50SWRcIjogXCI2ODkyNDM1OTYwNjBcIixcclxuLy8gICAgICAgICBcInByb3RvY29sXCI6IFwiSFRUUC8xLjFcIixcclxuLy8gICAgICAgICBcInN0YWdlXCI6IFwicHJvZFwiLFxyXG4vLyAgICAgICAgIFwiZG9tYWluUHJlZml4XCI6IFwiNHdiM2xub3ZvOFwiLFxyXG4vLyAgICAgICAgIFwicmVxdWVzdFRpbWVFcG9jaFwiOiAxNTg3ODA4Nzk3MTcyLFxyXG4vLyAgICAgICAgIFwicmVxdWVzdElkXCI6IFwiYzA2NTNkMzItMDg0Ny00MmYyLWJlYWMtYmZlMGM5ZDM3Mzg4XCIsXHJcbi8vICAgICAgICAgXCJpZGVudGl0eVwiOiB7XHJcbi8vICAgICAgICAgICAgIFwiY29nbml0b0lkZW50aXR5UG9vbElkXCI6IG51bGwsXHJcbi8vICAgICAgICAgICAgIFwiYWNjb3VudElkXCI6IG51bGwsXHJcbi8vICAgICAgICAgICAgIFwiY29nbml0b0lkZW50aXR5SWRcIjogbnVsbCxcclxuLy8gICAgICAgICAgICAgXCJjYWxsZXJcIjogbnVsbCxcclxuLy8gICAgICAgICAgICAgXCJzb3VyY2VJcFwiOiBcIjIxNy4xMzguMjA4LjE2NlwiLFxyXG4vLyAgICAgICAgICAgICBcInByaW5jaXBhbE9yZ0lkXCI6IG51bGwsXHJcbi8vICAgICAgICAgICAgIFwiYWNjZXNzS2V5XCI6IG51bGwsXHJcbi8vICAgICAgICAgICAgIFwiY29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZVwiOiBudWxsLFxyXG4vLyAgICAgICAgICAgICBcImNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyXCI6IG51bGwsXHJcbi8vICAgICAgICAgICAgIFwidXNlckFyblwiOiBudWxsLFxyXG4vLyAgICAgICAgICAgICBcInVzZXJBZ2VudFwiOiBcImN1cmwvNy41OC4wXCIsXHJcbi8vICAgICAgICAgICAgIFwidXNlclwiOiBudWxsXHJcbi8vICAgICAgICAgfSxcclxuLy8gICAgICAgICBcImRvbWFpbk5hbWVcIjogXCI0d2IzbG5vdm84LmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXCIsXHJcbi8vICAgICAgICAgXCJhcGlJZFwiOiBcIjR3YjNsbm92bzhcIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIFwiYm9keVwiOiBudWxsLFxyXG4vLyAgICAgXCJpc0Jhc2U2NEVuY29kZWRcIjogZmFsc2VcclxuLy8gfSk7Il19