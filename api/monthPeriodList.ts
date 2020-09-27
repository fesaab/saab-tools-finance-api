import { MonthPeriodMapping, MonthPeriodRepository } from '../dynamodb/monthPeriod'

class MonthPeriodApiListHandler {

    private monthPeriodRepository: MonthPeriodRepository;

    constructor() {
        this.monthPeriodRepository = new MonthPeriodRepository();
    }

    async handleRequest(month: string) : Promise<MonthPeriodMapping> {
        // 1 - Search the month period
        let monthPeriodResult = await this.monthPeriodRepository.query({ 
            month: month 
        });

        return new Promise(resolve => resolve(monthPeriodResult || {}));
    }
}

exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));
    
    let response: any = {};
    try {    
        const month = event.pathParameters.month;
        const apiHandler = new MonthPeriodApiListHandler();
        const monthResponse = await apiHandler.handleRequest(month);

        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(monthResponse)
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