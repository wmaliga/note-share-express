import DynamodbConfig from "./dynamodb.config";

describe('DynamoDB Config', () => {
    test('errorHandler success', () => {
        console.log = jest.fn();

        DynamodbConfig.errorHandler(undefined,'data');

        expect(console.log).toHaveBeenCalledWith(expect.anything(), 'data');
    });

    test('errorHandler error', () => {
        console.log = jest.fn();

        DynamodbConfig.errorHandler('error', undefined);

        expect(console.log).toHaveBeenCalledWith(expect.anything(), 'error');
    });
});
