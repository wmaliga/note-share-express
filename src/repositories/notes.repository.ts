import {randomUUID} from "crypto";

import AWS from "aws-sdk";
import createHttpError from "http-errors";
import {Service} from "typedi";

import DynamodbConfig from "../config/dynamodb.config";
import {Note} from "../models/notes.model";

const tableName = 'NotesTable';

DynamodbConfig.config();
const client = new AWS.DynamoDB.DocumentClient();

@Service()
export default class NotesRepository {

    async findPublicNotes(): Promise<Note[]> {
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

    async getNoteType(id: string): Promise<string> {
        const params = {
            TableName: tableName,
            AttributesToGet: ['type'],
            Key: {id: id}
        };

        let results = await client.get(params).promise();

        if (!results.Item) {
            throw createHttpError(404, "Note not found");
        }

        return results.Item.type;
    }

    async getNote(id: string): Promise<Note> {
        const params = {
            TableName: tableName,
            Key: {id: id}
        };

        let results = await client.get(params).promise();

        if (!results.Item) {
            throw createHttpError(404, "Note not found");
        }

        return NotesRepository.parseNote(results.Item);
    }

    async saveNote(note: Note): Promise<string> {
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