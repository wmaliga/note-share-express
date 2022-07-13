import AWS from 'aws-sdk';
import DynamodbConfig from "../config/dynamodb.config";

const notesTable = {
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: "NotesTable"
};

DynamodbConfig.config();
const dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});

dynamodb.createTable(notesTable, DynamodbConfig.errorHandler);
