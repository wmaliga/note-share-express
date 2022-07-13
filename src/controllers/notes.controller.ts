import {Request, Response} from "express";

import {Note} from "../models/notes.model";
import NotesService from "../services/notes.service";

export default class NotesController {
    static saveNote(req: Request, res: Response) {
        console.log('[NotesController] POST call saveNote');
        const note = NotesController.parseNote(req.body);
        NotesService.saveNote(note);
        res.sendStatus(200);
    }

    private static parseNote(json: any): Note {
        return {
            ...json,
            expirationDate: new Date(json.expirationDate)
        } as Note;
    }
}
