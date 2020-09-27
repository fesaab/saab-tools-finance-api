const api = require("../api/monthPeriodUpdate");
let response = api.handler({
    "resource": "/month",
    "path": "/month",
    "httpMethod": "POST",
    "queryStringParameters": {
    },
    "multiValueQueryStringParameters": {
    },
    "pathParameters": {
        "month": "10"
    },
    "stageVariables": null,
    "requestContext": {
        "resourceId": "dm595m",
        "authorizer": {
            "principalId": "me",
            "integrationLatency": 0
        },
        "resourcePath": "/transactions",
        "httpMethod": "GET",
        "extendedRequestId": "LiaEkHIfoAMFnMQ=",
        "requestTime": "25/Apr/2020:09:59:57 +0000",
        "path": "/prod/transactions",
        "accountId": "689243596060",
        "protocol": "HTTP/1.1",
        "stage": "prod",
        "domainPrefix": "4wb3lnovo8",
        "requestTimeEpoch": 1587808797172,
        "requestId": "c0653d32-0847-42f2-beac-bfe0c9d37388",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "217.138.208.166",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "curl/7.58.0",
            "user": null
        },
        "domainName": "4wb3lnovo8.execute-api.us-east-1.amazonaws.com",
        "apiId": "4wb3lnovo8"
    },
    "body": "{\"month\": \"10\", \"startDate\": \"2020-09-24\", \"endDate\": \"2020-10-24\"}",
    "isBase64Encoded": false
});

console.log(response);