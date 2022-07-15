import createHttpError from 'http-errors';

import {Note, NoteType} from "../models/notes.model";
import NotesRepository from "../repositories/notes.repository";

export default class NotesService {
    static async findPublicNotes(): Promise<Note[]> {
        console.log('[NotesService] Find public notes');
        return await NotesRepository.findPublicNotes();
    }

    static async getNoteType(id: string): Promise<string> {
        console.log('[NotesService] Get note type id =', id);
        return await NotesRepository.getNoteType(id);
    }

    static async getNote(id: string, password: string): Promise<Note> {
        console.log('[NotesService] Get note id =', id);
        const note = await NotesRepository.getNote(id);

        if (note.expirationDate && note.expirationDate < new Date()) {
            throw createHttpError(410, "Note expired");
        }

        if (note.type === NoteType.PRIVATE && note.password != password) {
            throw createHttpError(401, "Unauthorized");
        }

        return note;
    }

    static async saveNote(note: Note): Promise<string> {
        console.log('[NotesService] Save note:', note);

        if (note.expirationDate && note.expirationDate <= new Date()) {
            throw createHttpError(422, 'Expiration date cannot be in the past');
        }

        if (note.type === NoteType.PRIVATE) {
            if (!note.password) {
                throw createHttpError(422, "Missing password for private note");
            }
        } else {
            note.password = undefined;
        }

        return await NotesRepository.saveNote(note);
    }
}