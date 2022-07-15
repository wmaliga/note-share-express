import {NextFunction, Request, Response} from "express";

import {Note} from "../models/notes.model";
import NotesService from "../services/notes.service";

export default class NotesController {
    static async findPublicNotes(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call findPublicNotes');
        NotesService.findPublicNotes().then(notes => {
            res.status(200).json(notes);
        }).catch(next);
    }

    static async getNoteType(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call getNoteType');
        NotesService.getNoteType(req.params.id).then(type => {
            res.status(200).json(type);
        }).catch(next);
    }

    static async getNote(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call getNote');
        NotesService.getNote(req.params.id).then(note => {
            res.status(200).json(note);
        }).catch(next);
    }

    static async saveNote(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] POST call saveNote');
        const note = NotesController.parseNote(req.body);
        NotesService.saveNote(note).then(id => {
            res.status(201).set('Location', id).send();
        }).catch(next);
    }

    private static parseNote(json: any): Note {
        return {
            ...json,
            expirationDate: new Date(json.expirationDate)
        } as Note;
    }
}
