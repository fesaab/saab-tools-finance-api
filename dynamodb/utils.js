"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
function createDynamoDbClient(regionName) {
    AWS.config.update({ region: regionName });
    return new AWS.DynamoDB();
}
exports.createDynamoDbClient = createDynamoDbClient;
;
function handleQueryError(err) {
    if (!err) {
        console.error('Encountered error object was empty');
        return;
    }
    if (!err.code) {
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
        return;
    }
    // here are no API specific errors to handle for Query, common DynamoDB API errors are handled below
    handleCommonErrors(err);
}
exports.handleQueryError = handleQueryError;
function handleCommonErrors(err) {
    switch (err.code) {
        case 'InternalServerError':
            console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ProvisionedThroughputExceededException':
            console.error(`Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.`
                + `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
            return;
        case 'ResourceNotFoundException':
            console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
            return;
        case 'ServiceUnavailable':
            console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ThrottlingException':
            console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'UnrecognizedClientException':
            console.error(`The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.`
                + `Error: ${err.message}`);
            return;
        case 'ValidationException':
            console.error(`The input fails to satisfy the constraints specified by DynamoDB, `
                + `fix input before retrying. Error: ${err.message}`);
            return;
        case 'RequestLimitExceeded':
            console.error(`Throughput exceeds the current throughput limit for your account, `
                + `increase account level throughput before retrying. Error: ${err.message}`);
            return;
        default:
            console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
            return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUUvQixTQUFnQixvQkFBb0IsQ0FBQyxVQUFrQjtJQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUIsQ0FBQztBQUhELG9EQUdDO0FBQUEsQ0FBQztBQUVGLFNBQWdCLGdCQUFnQixDQUFDLEdBQWlCO0lBQzlDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDcEQsT0FBTztLQUNWO0lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLDJFQUEyRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoSCxPQUFPO0tBQ1Y7SUFFRCxvR0FBb0c7SUFDcEcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQVpELDRDQVlDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxHQUFpQjtJQUN6QyxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDZCxLQUFLLHFCQUFxQjtZQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLG9GQUFvRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNqSCxPQUFPO1FBQ1gsS0FBSyx3Q0FBd0M7WUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpSEFBaUg7a0JBQ3pILGtJQUFrSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN2SixPQUFPO1FBQ1gsS0FBSywyQkFBMkI7WUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnRkFBZ0YsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDN0csT0FBTztRQUNYLEtBQUssb0JBQW9CO1lBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEZBQTRGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ3pILE9BQU87UUFDWCxLQUFLLHFCQUFxQjtZQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLCtGQUErRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM1SCxPQUFPO1FBQ1gsS0FBSyw2QkFBNkI7WUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyx3SEFBd0g7a0JBQ2hJLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDL0IsT0FBTztRQUNYLEtBQUsscUJBQXFCO1lBQ3RCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0VBQW9FO2tCQUM1RSxxQ0FBcUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDMUQsT0FBTztRQUNYLEtBQUssc0JBQXNCO1lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0VBQW9FO2tCQUM1RSw2REFBNkQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEYsT0FBTztRQUNYO1lBQ0ksT0FBTyxDQUFDLEtBQUssQ0FBQywyRUFBMkUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDeEcsT0FBTztLQUNkO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEeW5hbW9EYkNsaWVudChyZWdpb25OYW1lOiBzdHJpbmcpOiBBV1MuRHluYW1vREIge1xyXG4gICAgQVdTLmNvbmZpZy51cGRhdGUoeyByZWdpb246IHJlZ2lvbk5hbWUgfSk7XHJcbiAgICByZXR1cm4gbmV3IEFXUy5EeW5hbW9EQigpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVF1ZXJ5RXJyb3IoZXJyOiBBV1MuQVdTRXJyb3IpOiB2b2lkIHtcclxuICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRW5jb3VudGVyZWQgZXJyb3Igb2JqZWN0IHdhcyBlbXB0eScpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghZXJyLmNvZGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGBBbiBleGNlcHRpb24gb2NjdXJyZWQsIGludmVzdGlnYXRlIGFuZCBjb25maWd1cmUgcmV0cnkgc3RyYXRlZ3kuIEVycm9yOiAke0pTT04uc3RyaW5naWZ5KGVycil9YCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBoZXJlIGFyZSBubyBBUEkgc3BlY2lmaWMgZXJyb3JzIHRvIGhhbmRsZSBmb3IgUXVlcnksIGNvbW1vbiBEeW5hbW9EQiBBUEkgZXJyb3JzIGFyZSBoYW5kbGVkIGJlbG93XHJcbiAgICBoYW5kbGVDb21tb25FcnJvcnMoZXJyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29tbW9uRXJyb3JzKGVycjogQVdTLkFXU0Vycm9yKSB7XHJcbiAgICBzd2l0Y2ggKGVyci5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSAnSW50ZXJuYWxTZXJ2ZXJFcnJvcic6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEludGVybmFsIFNlcnZlciBFcnJvciwgZ2VuZXJhbGx5IHNhZmUgdG8gcmV0cnkgd2l0aCBleHBvbmVudGlhbCBiYWNrLW9mZi4gRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjYXNlICdQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZEV4Y2VwdGlvbic6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFJlcXVlc3QgcmF0ZSBpcyB0b28gaGlnaC4gSWYgeW91J3JlIHVzaW5nIGEgY3VzdG9tIHJldHJ5IHN0cmF0ZWd5IG1ha2Ugc3VyZSB0byByZXRyeSB3aXRoIGV4cG9uZW50aWFsIGJhY2stb2ZmLmBcclxuICAgICAgICAgICAgICAgICsgYE90aGVyd2lzZSBjb25zaWRlciByZWR1Y2luZyBmcmVxdWVuY3kgb2YgcmVxdWVzdHMgb3IgaW5jcmVhc2luZyBwcm92aXNpb25lZCBjYXBhY2l0eSBmb3IgeW91ciB0YWJsZSBvciBzZWNvbmRhcnkgaW5kZXguIEVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY2FzZSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbic6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE9uZSBvZiB0aGUgdGFibGVzIHdhcyBub3QgZm91bmQsIHZlcmlmeSB0YWJsZSBleGlzdHMgYmVmb3JlIHJldHJ5aW5nLiBFcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNhc2UgJ1NlcnZpY2VVbmF2YWlsYWJsZSc6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEhhZCB0cm91YmxlIHJlYWNoaW5nIER5bmFtb0RCLiBnZW5lcmFsbHkgc2FmZSB0byByZXRyeSB3aXRoIGV4cG9uZW50aWFsIGJhY2stb2ZmLiBFcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNhc2UgJ1Rocm90dGxpbmdFeGNlcHRpb24nOlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBSZXF1ZXN0IGRlbmllZCBkdWUgdG8gdGhyb3R0bGluZywgZ2VuZXJhbGx5IHNhZmUgdG8gcmV0cnkgd2l0aCBleHBvbmVudGlhbCBiYWNrLW9mZi4gRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjYXNlICdVbnJlY29nbml6ZWRDbGllbnRFeGNlcHRpb24nOlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBUaGUgcmVxdWVzdCBzaWduYXR1cmUgaXMgaW5jb3JyZWN0IG1vc3QgbGlrZWx5IGR1ZSB0byBhbiBpbnZhbGlkIEFXUyBhY2Nlc3Mga2V5IElEIG9yIHNlY3JldCBrZXksIGZpeCBiZWZvcmUgcmV0cnlpbmcuYFxyXG4gICAgICAgICAgICAgICAgKyBgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjYXNlICdWYWxpZGF0aW9uRXhjZXB0aW9uJzpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVGhlIGlucHV0IGZhaWxzIHRvIHNhdGlzZnkgdGhlIGNvbnN0cmFpbnRzIHNwZWNpZmllZCBieSBEeW5hbW9EQiwgYFxyXG4gICAgICAgICAgICAgICAgKyBgZml4IGlucHV0IGJlZm9yZSByZXRyeWluZy4gRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjYXNlICdSZXF1ZXN0TGltaXRFeGNlZWRlZCc6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFRocm91Z2hwdXQgZXhjZWVkcyB0aGUgY3VycmVudCB0aHJvdWdocHV0IGxpbWl0IGZvciB5b3VyIGFjY291bnQsIGBcclxuICAgICAgICAgICAgICAgICsgYGluY3JlYXNlIGFjY291bnQgbGV2ZWwgdGhyb3VnaHB1dCBiZWZvcmUgcmV0cnlpbmcuIEVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQW4gZXhjZXB0aW9uIG9jY3VycmVkLCBpbnZlc3RpZ2F0ZSBhbmQgY29uZmlndXJlIHJldHJ5IHN0cmF0ZWd5LiBFcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG59Il19