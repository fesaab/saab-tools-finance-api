import { MonthPeriodMapping, MonthPeriodRepository } from '../dynamodb/monthPeriod'

exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));
    
    let response: any = {};
    try {    
        // Parse the request
        const monthPeriod: MonthPeriodMapping = JSON.parse(event.body);
        
        // Persist the month
        const monthPeriodRepository = new MonthPeriodRepository();
        await monthPeriodRepository.putItem(monthPeriod);

        // Return the response
        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: true
            })
        };

    } catch (exception) {
        console.error(exception);
        response = {
            statusCode: 500,
            headers: {},
            body: JSON.stringify(exception)
        };
    }
    
    console.log("Response: " + JSON.stringify(response));
    return response;

}