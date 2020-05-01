import * as AWS from 'aws-sdk';
import { TransactionRepository } from '../dynamodb/transaction'

exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));

    let response: any = {};

    try {
        const transactionRepository = new TransactionRepository();
    
        const transactionQueryResponse = await transactionRepository.list({
            startDate: event.queryStringParameters.startDate,
            endDate: event.queryStringParameters.endDate
        });
    
        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'transactions': transactionQueryResponse.transactionList,
                'count': transactionQueryResponse.count,
                'lastEvaluatedKey': transactionQueryResponse.lastEvaluatedKey
            })
        };
       
    } catch (e) {
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