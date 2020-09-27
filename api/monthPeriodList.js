"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monthPeriod_1 = require("../dynamodb/monthPeriod");
class MonthPeriodApiListHandler {
    constructor() {
        this.monthPeriodRepository = new monthPeriod_1.MonthPeriodRepository();
    }
    async handleRequest(month) {
        // 1 - Search the month period
        let monthPeriodResult = await this.monthPeriodRepository.query({
            month: month
        });
        return new Promise(resolve => resolve(monthPeriodResult || {}));
    }
}
exports.handler = async (event = {}) => {
    console.log("About to process request: " + JSON.stringify(event));
    let response = {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhQZXJpb2RMaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9udGhQZXJpb2RMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseURBQW1GO0FBRW5GLE1BQU0seUJBQXlCO0lBSTNCO1FBQ0ksSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksbUNBQXFCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFhO1FBQzdCLDhCQUE4QjtRQUM5QixJQUFJLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztZQUMzRCxLQUFLLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0NBQ0o7QUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBRSxFQUFFO0lBRXhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWxFLElBQUksUUFBUSxHQUFRLEVBQUUsQ0FBQztJQUN2QixJQUFJO1FBQ0EsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RCxRQUFRLEdBQUc7WUFDUCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2FBQ3JDO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1NBQ3RDLENBQUM7S0FFTDtJQUFDLE9BQU8sU0FBUyxFQUFFO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsUUFBUSxHQUFHO1lBQ1AsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztTQUNsQyxDQUFDO0tBQ0w7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxRQUFRLENBQUM7QUFFcEIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9udGhQZXJpb2RNYXBwaW5nLCBNb250aFBlcmlvZFJlcG9zaXRvcnkgfSBmcm9tICcuLi9keW5hbW9kYi9tb250aFBlcmlvZCdcclxuXHJcbmNsYXNzIE1vbnRoUGVyaW9kQXBpTGlzdEhhbmRsZXIge1xyXG5cclxuICAgIHByaXZhdGUgbW9udGhQZXJpb2RSZXBvc2l0b3J5OiBNb250aFBlcmlvZFJlcG9zaXRvcnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tb250aFBlcmlvZFJlcG9zaXRvcnkgPSBuZXcgTW9udGhQZXJpb2RSZXBvc2l0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlUmVxdWVzdChtb250aDogc3RyaW5nKSA6IFByb21pc2U8TW9udGhQZXJpb2RNYXBwaW5nPiB7XHJcbiAgICAgICAgLy8gMSAtIFNlYXJjaCB0aGUgbW9udGggcGVyaW9kXHJcbiAgICAgICAgbGV0IG1vbnRoUGVyaW9kUmVzdWx0ID0gYXdhaXQgdGhpcy5tb250aFBlcmlvZFJlcG9zaXRvcnkucXVlcnkoeyBcclxuICAgICAgICAgICAgbW9udGg6IG1vbnRoIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKG1vbnRoUGVyaW9kUmVzdWx0IHx8IHt9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55ID0ge30pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkFib3V0IHRvIHByb2Nlc3MgcmVxdWVzdDogXCIgKyBKU09OLnN0cmluZ2lmeShldmVudCkpO1xyXG4gICAgXHJcbiAgICBsZXQgcmVzcG9uc2U6IGFueSA9IHt9O1xyXG4gICAgdHJ5IHsgICAgXHJcbiAgICAgICAgY29uc3QgbW9udGggPSBldmVudC5wYXRoUGFyYW1ldGVycy5tb250aDtcclxuICAgICAgICBjb25zdCBhcGlIYW5kbGVyID0gbmV3IE1vbnRoUGVyaW9kQXBpTGlzdEhhbmRsZXIoKTtcclxuICAgICAgICBjb25zdCBtb250aFJlc3BvbnNlID0gYXdhaXQgYXBpSGFuZGxlci5oYW5kbGVSZXF1ZXN0KG1vbnRoKTtcclxuXHJcbiAgICAgICAgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShtb250aFJlc3BvbnNlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihleGNlcHRpb24pO1xyXG4gICAgICAgIHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShleGNlcHRpb24pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coXCJSZXNwb25zZTogXCIgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxufSJdfQ==