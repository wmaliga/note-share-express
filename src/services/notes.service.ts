import {Note} from "../models/notes.model";
import NotesRepository from "../repositories/notes.repository";

export default class NotesService {
    static saveNote(note: Note) {
        console.log('[NotesService] Save note:', note);
        NotesRepository.saveNote(note);
    }
}