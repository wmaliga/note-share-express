import {Request, Response} from "express";

import {Note} from "../models/notes.model";
import NotesService from "../services/notes.service";

export default class NotesController {
    static async findPublicNotes(req: Request, res: Response) {
        console.log('[NotesController] GET call findPublicNotes');
        NotesService.findPublicNotes().then(notes => {
            res.status(200).json(notes);
        }).catch(error => {
            res.status(500).json(error);
        });
    }

    static async saveNote(req: Request, res: Response) {
        console.log('[NotesController] POST call saveNote');
        const note = NotesController.parseNote(req.body);
        NotesService.saveNote(note).then(id => {
            res.status(201).set('Location', id).send();
        }).catch(error => {
            res.status(500).json(error);
        });
    }

    private static parseNote(json: any): Note {
        return {
            ...json,
            expirationDate: new Date(json.expirationDate)
        } as Note;
    }
}
