"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("../dynamodb/transaction");
exports.handler = async (event = {}) => {
    console.log("About to process request: " + JSON.stringify(event));
    let response = {};
    try {
        const transactionRepository = new transaction_1.TransactionRepository();
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
    }
    catch (e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5REFBK0Q7QUFFL0QsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsUUFBYSxFQUFFLEVBQUUsRUFBRTtJQUV4QyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVsRSxJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUM7SUFFdkIsSUFBSTtRQUNBLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxtQ0FBcUIsRUFBRSxDQUFDO1FBRTFELE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDOUQsU0FBUyxFQUFFLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTO1lBQ2hELE9BQU8sRUFBRSxLQUFLLENBQUMscUJBQXFCLENBQUMsT0FBTztTQUMvQyxDQUFDLENBQUM7UUFFSCxRQUFRLEdBQUc7WUFDUCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2FBQ3JDO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLGNBQWMsRUFBRSx3QkFBd0IsQ0FBQyxlQUFlO2dCQUN4RCxPQUFPLEVBQUUsd0JBQXdCLENBQUMsS0FBSztnQkFDdkMsa0JBQWtCLEVBQUUsd0JBQXdCLENBQUMsZ0JBQWdCO2FBQ2hFLENBQUM7U0FDTCxDQUFDO0tBRUw7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsUUFBUSxHQUFHO1lBQ1AsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUMxQixDQUFDO0tBQ0w7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxRQUFRLENBQUM7QUFFcEIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xyXG5pbXBvcnQgeyBUcmFuc2FjdGlvblJlcG9zaXRvcnkgfSBmcm9tICcuLi9keW5hbW9kYi90cmFuc2FjdGlvbidcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55ID0ge30pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkFib3V0IHRvIHByb2Nlc3MgcmVxdWVzdDogXCIgKyBKU09OLnN0cmluZ2lmeShldmVudCkpO1xyXG5cclxuICAgIGxldCByZXNwb25zZTogYW55ID0ge307XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB0cmFuc2FjdGlvblJlcG9zaXRvcnkgPSBuZXcgVHJhbnNhY3Rpb25SZXBvc2l0b3J5KCk7XHJcbiAgICBcclxuICAgICAgICBjb25zdCB0cmFuc2FjdGlvblF1ZXJ5UmVzcG9uc2UgPSBhd2FpdCB0cmFuc2FjdGlvblJlcG9zaXRvcnkubGlzdCh7XHJcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgZW5kRGF0ZTogZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzLmVuZERhdGVcclxuICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zYWN0aW9ucyc6IHRyYW5zYWN0aW9uUXVlcnlSZXNwb25zZS50cmFuc2FjdGlvbkxpc3QsXHJcbiAgICAgICAgICAgICAgICAnY291bnQnOiB0cmFuc2FjdGlvblF1ZXJ5UmVzcG9uc2UuY291bnQsXHJcbiAgICAgICAgICAgICAgICAnbGFzdEV2YWx1YXRlZEtleSc6IHRyYW5zYWN0aW9uUXVlcnlSZXNwb25zZS5sYXN0RXZhbHVhdGVkS2V5XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgICAgIFxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVyczoge30sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGUpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG59Il19