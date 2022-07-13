import {Note} from "../models/notes.model";

export default class NotesService {
    static saveNote(note: Note) {
        console.log('[NotesService] Save note:');
        console.log(note);
    }
}