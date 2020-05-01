const api = require("../api/category");
api.handler({
    "resource": "/transactions",
    "path": "/transactions",
    "httpMethod": "GET",
    "headers": {
        "Accept": "*/*",
        "Authorization": "Basic 123456",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Host": "4wb3lnovo8.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "curl/7.58.0",
        "Via": "2.0 aa7679f2d01b23d9a66bfa6e92991b05.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "lkw-Ko1-7RT2vuR-mMlEkrc7Eg9gPOzfi-bspYyTNJpQ4qXSDdPaCQ==",
        "X-Amzn-Trace-Id": "Root=1-5ea40a1d-ca1b3ec09bb9143089b70af0",
        "X-Forwarded-For": "217.138.208.166, 130.176.29.71",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [
            "*/*"
        ],
        "Authorization": [
            "Basic 123456"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-Country": [
            "US"
        ],
        "Host": [
            "4wb3lnovo8.execute-api.us-east-1.amazonaws.com"
        ],
        "User-Agent": [
            "curl/7.58.0"
        ],
        "Via": [
            "2.0 aa7679f2d01b23d9a66bfa6e92991b05.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "lkw-Ko1-7RT2vuR-mMlEkrc7Eg9gPOzfi-bspYyTNJpQ4qXSDdPaCQ=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-5ea40a1d-ca1b3ec09bb9143089b70af0"
        ],
        "X-Forwarded-For": [
            "217.138.208.166, 130.176.29.71"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": {
    },
    "multiValueQueryStringParameters": {
    },
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "dm595m",
        "authorizer": {
            "principalId": "me",
            "integrationLatency": 0
        },
        "resourcePath": "/transactions/category",
        "httpMethod": "GET",
        "extendedRequestId": "LiaEkHIfoAMFnMQ=",
        "requestTime": "25/Apr/2020:09:59:57 +0000",
        "path": "/prod/transactions/category",
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
    "body": "[{\"transactionId\": \"77321102-c706-4437-abdb-97fdf93cb463\", \"description\": \"FXCHG_*\", \"category\": \"Brasil\"}, {\"transactionId\": \"2e4cb0b6-0eb6-45d3-a52d-54ccf8bc00cc\", \"description\": \"Bottlesapp Ca\", \"category\": \"Mercado\"},{\"transactionId\": \"56ac0684-ac25-4d6d-80e6-ce514b633a4c\", \"description\": \"Rental\", \"category\": \"Aluguel\"}]",
    "isBase64Encoded": false
});

