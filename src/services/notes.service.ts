import createHttpError from 'http-errors';
import {Service} from "typedi";

import {Note, NoteType} from "../models/notes.model";
import NotesRepository from "../repositories/notes.repository";
import PasswordUtil from "../utils/password.util";

@Service()
export default class NotesService {
    constructor(
        private notesRepository: NotesRepository,
        private passwordUtil: PasswordUtil
    ) {
    }

    async findPublicNotes(): Promise<Note[]> {
        console.log('[NotesService] Find public notes');
        return await this.notesRepository.findPublicNotes();
    }

    async getNoteType(id: string): Promise<string> {
        console.log('[NotesService] Get note type id =', id);
        return await this.notesRepository.getNoteType(id);
    }

    async getNote(id: string, password: string): Promise<Note> {
        console.log('[NotesService] Get note id =', id);
        const note = await this.notesRepository.getNote(id);

        if (note.expirationDate && note.expirationDate < new Date()) {
            throw createHttpError(410, "Note expired");
        }

        if (note.type === NoteType.PRIVATE && note.password != this.passwordUtil.encrypt(password)) {
            throw createHttpError(401, "Unauthorized");
        }

        return note;
    }

    async saveNote(note: Note): Promise<string> {
        console.log('[NotesService] Save note:', note);

        if (note.expirationDate && note.expirationDate <= new Date()) {
            throw createHttpError(422, 'Expiration date cannot be in the past');
        }

        if (note.type === NoteType.PRIVATE) {
            if (!note.password) {
                throw createHttpError(422, "Missing password for private note");
            }

            note.password = this.passwordUtil.encrypt(note.password);
        } else {
            note.password = undefined;
        }

        return await this.notesRepository.saveNote(note);
    }
}