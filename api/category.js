"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categoryMapping_1 = require("../dynamodb/categoryMapping");
const transaction_1 = require("../dynamodb/transaction");
class CategoryMappingApiHandler {
    constructor() {
        this.categoryMappingRepository = new categoryMapping_1.CategoryMappingRepository();
        this.transactionRepository = new transaction_1.TransactionRepository();
    }
    async handleRequest(categoryMappingList) {
        try {
            for (let i = 0; i < categoryMappingList.length; i++) {
                let item = categoryMappingList[i];
                console.log("Processing: " + JSON.stringify(item));
                // 1 - Search the category mapping
                let categoryMappingResult = await this.categoryMappingRepository.query({
                    description: item.description
                });
                // 2 - If it exists then update it, otherwise create it
                let categoryMapping = {};
                if (categoryMappingResult.count > 0) {
                    categoryMapping = categoryMappingResult.categoryMappingList[0];
                    categoryMapping.category = item.category;
                }
                else {
                    categoryMapping = {
                        description: item.description,
                        category: item.category,
                        regex: item.description.endsWith("*")
                    };
                }
                await this.categoryMappingRepository.putItem(categoryMapping);
                // 3 - Update the transaction with the category
                if (item.transactionId) {
                    const queryResponse = await this.transactionRepository.query({
                        id: item.transactionId
                    });
                    if (queryResponse.count > 0) {
                        const transaction = queryResponse.transactionList[0];
                        transaction.category = item.category;
                        await this.transactionRepository.updateCategory(transaction);
                    }
                }
            }
        }
        catch (exception) {
            throw exception;
        }
        return new Promise(resolve => resolve());
    }
}
exports.handler = async (event = {}) => {
    console.log("About to process request: " + JSON.stringify(event));
    let response = {};
    try {
        const categories = JSON.parse(event.body);
        const apiHandler = new CategoryMappingApiHandler();
        await apiHandler.handleRequest(categories);
        response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'status': true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYXRlZ29yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlFQUF3RjtBQUN4Rix5REFBZ0U7QUFRaEUsTUFBTSx5QkFBeUI7SUFLM0I7UUFDSSxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSwyQ0FBeUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLG1DQUFxQixFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsbUJBQWtEO1FBRWxFLElBQUk7WUFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUVuRCxrQ0FBa0M7Z0JBQ2xDLElBQUkscUJBQXFCLEdBQUcsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDO29CQUNuRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUJBQ2hDLENBQUMsQ0FBQztnQkFFSCx1REFBdUQ7Z0JBQ3ZELElBQUksZUFBZSxHQUFvQixFQUFFLENBQUM7Z0JBQzFDLElBQUkscUJBQXFCLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDakMsZUFBZSxHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxlQUFlLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQzVDO3FCQUNJO29CQUNELGVBQWUsR0FBRzt3QkFDZCxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7d0JBQzdCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztxQkFDeEMsQ0FBQztpQkFDTDtnQkFDRCxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRTlELCtDQUErQztnQkFDL0MsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNwQixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7d0JBQ3pELEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYTtxQkFDekIsQ0FBQyxDQUFDO29CQUVILElBQUksYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7d0JBQ3pCLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JELFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFDckMsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3FCQUNoRTtpQkFDSjthQUNKO1NBRUo7UUFBQyxPQUFPLFNBQVMsRUFBRTtZQUNoQixNQUFNLFNBQVMsQ0FBQztTQUNuQjtRQUVELE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDSjtBQUlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLFFBQWEsRUFBRSxFQUFFLEVBQUU7SUFFeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFbEUsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO0lBQ3ZCLElBQUk7UUFDQSxNQUFNLFVBQVUsR0FBa0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ25ELE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzQyxRQUFRLEdBQUc7WUFDUCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsa0JBQWtCO2FBQ3JDO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJO2FBQ2pCLENBQUM7U0FDTCxDQUFDO0tBRUw7SUFBQyxPQUFPLFNBQVMsRUFBRTtRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLFFBQVEsR0FBRztZQUNQLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFLEVBQUU7WUFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7U0FDbEMsQ0FBQztLQUNMO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sUUFBUSxDQUFDO0FBRXBCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3J5TWFwcGluZ1JlcG9zaXRvcnksIENhdGVnb3J5TWFwcGluZyB9IGZyb20gJy4uL2R5bmFtb2RiL2NhdGVnb3J5TWFwcGluZydcclxuaW1wb3J0IHsgVHJhbnNhY3Rpb25SZXBvc2l0b3J5IH0gZnJvbSAnLi4vZHluYW1vZGIvdHJhbnNhY3Rpb24nO1xyXG5cclxuaW50ZXJmYWNlIENhdGVnb3J5TWFwcGluZ1JlcXVlc3Qge1xyXG4gICAgcmVhZG9ubHkgdHJhbnNhY3Rpb25JZDogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGNhdGVnb3J5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIENhdGVnb3J5TWFwcGluZ0FwaUhhbmRsZXIge1xyXG5cclxuICAgIHByaXZhdGUgY2F0ZWdvcnlNYXBwaW5nUmVwb3NpdG9yeTogQ2F0ZWdvcnlNYXBwaW5nUmVwb3NpdG9yeTtcclxuICAgIHByaXZhdGUgdHJhbnNhY3Rpb25SZXBvc2l0b3J5OiBUcmFuc2FjdGlvblJlcG9zaXRvcnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeU1hcHBpbmdSZXBvc2l0b3J5ID0gbmV3IENhdGVnb3J5TWFwcGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgICB0aGlzLnRyYW5zYWN0aW9uUmVwb3NpdG9yeSA9IG5ldyBUcmFuc2FjdGlvblJlcG9zaXRvcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBoYW5kbGVSZXF1ZXN0KGNhdGVnb3J5TWFwcGluZ0xpc3Q6IEFycmF5PENhdGVnb3J5TWFwcGluZ1JlcXVlc3Q+KSA6IFByb21pc2U8dm9pZD4ge1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhdGVnb3J5TWFwcGluZ0xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gY2F0ZWdvcnlNYXBwaW5nTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb2Nlc3Npbmc6IFwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gMSAtIFNlYXJjaCB0aGUgY2F0ZWdvcnkgbWFwcGluZ1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5TWFwcGluZ1Jlc3VsdCA9IGF3YWl0IHRoaXMuY2F0ZWdvcnlNYXBwaW5nUmVwb3NpdG9yeS5xdWVyeSh7IFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLmRlc2NyaXB0aW9uIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIC8vIDIgLSBJZiBpdCBleGlzdHMgdGhlbiB1cGRhdGUgaXQsIG90aGVyd2lzZSBjcmVhdGUgaXRcclxuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeU1hcHBpbmc6IENhdGVnb3J5TWFwcGluZyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5TWFwcGluZ1Jlc3VsdC5jb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeU1hcHBpbmcgPSBjYXRlZ29yeU1hcHBpbmdSZXN1bHQuY2F0ZWdvcnlNYXBwaW5nTGlzdFswXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeU1hcHBpbmcuY2F0ZWdvcnkgPSBpdGVtLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5TWFwcGluZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0uZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBpdGVtLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdleDogaXRlbS5kZXNjcmlwdGlvbi5lbmRzV2l0aChcIipcIilcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jYXRlZ29yeU1hcHBpbmdSZXBvc2l0b3J5LnB1dEl0ZW0oY2F0ZWdvcnlNYXBwaW5nKTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gMyAtIFVwZGF0ZSB0aGUgdHJhbnNhY3Rpb24gd2l0aCB0aGUgY2F0ZWdvcnlcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyYW5zYWN0aW9uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWVyeVJlc3BvbnNlID0gYXdhaXQgdGhpcy50cmFuc2FjdGlvblJlcG9zaXRvcnkucXVlcnkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS50cmFuc2FjdGlvbklkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWVyeVJlc3BvbnNlLmNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHF1ZXJ5UmVzcG9uc2UudHJhbnNhY3Rpb25MaXN0WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5jYXRlZ29yeSA9IGl0ZW0uY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudHJhbnNhY3Rpb25SZXBvc2l0b3J5LnVwZGF0ZUNhdGVnb3J5KHRyYW5zYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkgPSB7fSkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiQWJvdXQgdG8gcHJvY2VzcyByZXF1ZXN0OiBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XHJcbiAgICBcclxuICAgIGxldCByZXNwb25zZTogYW55ID0ge307XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5TWFwcGluZ1JlcXVlc3Q+ID0gSlNPTi5wYXJzZShldmVudC5ib2R5KTtcclxuICAgICAgICBjb25zdCBhcGlIYW5kbGVyID0gbmV3IENhdGVnb3J5TWFwcGluZ0FwaUhhbmRsZXIoKTtcclxuICAgICAgICBhd2FpdCBhcGlIYW5kbGVyLmhhbmRsZVJlcXVlc3QoY2F0ZWdvcmllcyk7XHJcblxyXG4gICAgICAgIHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXhjZXB0aW9uKTtcclxuICAgICAgICByZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXhjZXB0aW9uKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2U6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbn0iXX0=