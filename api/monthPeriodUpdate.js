"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monthPeriod_1 = require("../dynamodb/monthPeriod");
exports.handler = async (event = {}) => {
    console.log("About to process request: " + JSON.stringify(event));
    let response = {};
    try {
        // Parse the request
        const monthPeriod = JSON.parse(event.body);
        // Persist the month
        const monthPeriodRepository = new monthPeriod_1.MonthPeriodRepository();
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
    }
    catch (exception) {
        console.error(exception);
        response = {
            statusCode: 500,
            headers: {},
            body: JSON.stringify(exception)
        };
    }
    console.log("Response: " + JSON.stringify(response));
    return response;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhQZXJpb2RVcGRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb250aFBlcmlvZFVwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUFtRjtBQUVuRixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBRSxFQUFFO0lBRXhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWxFLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztJQUN2QixJQUFJO1FBQ0Esb0JBQW9CO1FBQ3BCLE1BQU0sV0FBVyxHQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvRCxvQkFBb0I7UUFDcEIsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLG1DQUFxQixFQUFFLENBQUM7UUFDMUQsTUFBTSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakQsc0JBQXNCO1FBQ3RCLFFBQVEsR0FBRztZQUNQLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxrQkFBa0I7YUFDckM7WUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakIsTUFBTSxFQUFFLElBQUk7YUFDZixDQUFDO1NBQ0wsQ0FBQztLQUVMO0lBQUMsT0FBTyxTQUFTLEVBQUU7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixRQUFRLEdBQUc7WUFDUCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQ2xDLENBQUM7S0FDTDtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNyRCxPQUFPLFFBQVEsQ0FBQztBQUVwQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb250aFBlcmlvZE1hcHBpbmcsIE1vbnRoUGVyaW9kUmVwb3NpdG9yeSB9IGZyb20gJy4uL2R5bmFtb2RiL21vbnRoUGVyaW9kJ1xyXG5cclxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkgPSB7fSkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiQWJvdXQgdG8gcHJvY2VzcyByZXF1ZXN0OiBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XHJcbiAgICBcclxuICAgIGxldCByZXNwb25zZTogYW55ID0ge307XHJcbiAgICB0cnkgeyAgICBcclxuICAgICAgICAvLyBQYXJzZSB0aGUgcmVxdWVzdFxyXG4gICAgICAgIGNvbnN0IG1vbnRoUGVyaW9kOiBNb250aFBlcmlvZE1hcHBpbmcgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFBlcnNpc3QgdGhlIG1vbnRoXHJcbiAgICAgICAgY29uc3QgbW9udGhQZXJpb2RSZXBvc2l0b3J5ID0gbmV3IE1vbnRoUGVyaW9kUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgIGF3YWl0IG1vbnRoUGVyaW9kUmVwb3NpdG9yeS5wdXRJdGVtKG1vbnRoUGVyaW9kKTtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIHRoZSByZXNwb25zZVxyXG4gICAgICAgIHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbik7XHJcbiAgICAgICAgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVyczoge30sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV4Y2VwdGlvbilcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG59Il19