import {randomUUID} from "crypto";

import AWS from "aws-sdk";

import DynamodbConfig from "../config/dynamodb.config";
import {Note} from "../models/notes.model";

const tableName = 'NotesTable';

DynamodbConfig.config();
const client = new AWS.DynamoDB.DocumentClient();

export default class NotesRepository {

    static saveNote(note: Note) {
        const params = {
            TableName: tableName,
            Item: {
                ...note,
                id: randomUUID(),
                expirationDate: note.expirationDate.toISOString().slice(0, 10)
            }
        }

        client.put(params, DynamodbConfig.errorHandler);
    }
}