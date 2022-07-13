import {Note} from "../models/notes.model";
import NotesRepository from "../repositories/notes.repository";

export default class NotesService {
    static async findPublicNotes(): Promise<Note[]> {
        console.log('[NotesService] Find public notes');
        return await NotesRepository.findPublicNotes();
    }

    static async saveNote(note: Note): Promise<string> {
        console.log('[NotesService] Save note:', note);
        return await NotesRepository.saveNote(note);
    }
}