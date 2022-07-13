import AWS from 'aws-sdk';

export default class DynamodbConfig {
    static config() {
        AWS.config.update({'region': 'eu-north-1'});
    }
}
