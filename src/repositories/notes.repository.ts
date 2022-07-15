import {randomUUID} from "crypto";

import AWS from "aws-sdk";

import DynamodbConfig from "../config/dynamodb.config";
import {Note} from "../models/notes.model";

const tableName = 'NotesTable';

DynamodbConfig.config();
const client = new AWS.DynamoDB.DocumentClient();

export default class NotesRepository {

    static async findPublicNotes(): Promise<Note[]> {
        const params = {
            TableName: tableName
        };

        let results = await client.scan(params).promise();
        return results.Items ? results.Items.map(i => NotesRepository.parseNote(i)) : [];
    }

    private static parseNote(json: any): Note {
        return {
            ...json,
            expirationDate: new Date(json.expirationDate)
        } as Note
    }

    static async getNoteType(id: string): Promise<string> {
        const params = {
            TableName: tableName,
            AttributesToGet: ['type'],
            Key: {id: id}
        };

        let results = await client.get(params).promise();
        return results.Item ? results.Item.type : null;
    }

    static async saveNote(note: Note): Promise<string> {
        const id = randomUUID();
        const params = {
            TableName: tableName,
            Item: {
                ...note,
                id: id,
                expirationDate: note.expirationDate.toISOString().slice(0, 10)
            }
        }

        client.put(params, DynamodbConfig.errorHandler);
        return id;
    }
}