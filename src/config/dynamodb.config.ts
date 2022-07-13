import AWS from 'aws-sdk';

export default class DynamodbConfig {
    static config() {
        AWS.config.update({'region': 'eu-north-1'});
    }

    static errorHandler(err: any, data: any) {
        if (err) {
            console.log("[DynamoDB] Error:", err);
        } else {
            console.log("[DynamoDB] Success:", data);
        }
    }
}
