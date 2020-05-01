import { CategoryMappingRepository, CategoryMapping } from '../dynamodb/categoryMapping'
import { TransactionRepository } from '../dynamodb/transaction';

interface CategoryMappingRequest {
    readonly transactionId: string;
    readonly description: string;
    readonly category: string;
}

class CategoryMappingApiHandler {

    private categoryMappingRepository: CategoryMappingRepository;
    private transactionRepository: TransactionRepository;

    constructor() {
        this.categoryMappingRepository = new CategoryMappingRepository();
        this.transactionRepository = new TransactionRepository();
    }

    async handleRequest(categoryMappingList: Array<CategoryMappingRequest>) : Promise<void> {

        try {
            for (let i = 0; i < categoryMappingList.length; i++) {
                let item = categoryMappingList[i];

                console.log("Processing: " + JSON.stringify(item));
        
                // 1 - Search the category mapping
                let categoryMappingResult = await this.categoryMappingRepository.query({ 
                    description: item.description 
                });
    
                // 2 - If it exists then update it, otherwise create it
                let categoryMapping: CategoryMapping = {};
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

        } catch (exception) {
            throw exception;
        }

        return new Promise(resolve => resolve());
    }
}



exports.handler = async (event: any = {}) => {

    console.log("About to process request: " + JSON.stringify(event));
    
    let response: any = {};
    try {
        const categories: Array<CategoryMappingRequest> = JSON.parse(event.body);
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