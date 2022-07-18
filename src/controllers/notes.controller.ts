import {NextFunction, Request, Response} from "express";
import {Service} from "typedi";

import {Note} from "../models/notes.model";
import NotesService from "../services/notes.service";

@Service()
export default class NotesController {
    constructor(
        public notesService: NotesService
    ) {
    }

    async findPublicNotes(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call findPublicNotes');
        this.notesService.findPublicNotes().then(notes => {
            res.status(200).json(notes);
        }).catch(next);
    }

    async getNoteType(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call getNoteType');
        this.notesService.getNoteType(req.params.id).then(type => {
            res.status(200).json(type);
        }).catch(next);
    }

    async getNote(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call getNote');
        const password = req.get('Authorization') || '';

        this.notesService.getNote(req.params.id, password).then(note => {
            res.status(200).json(note);
        }).catch(next);
    }

    async saveNote(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] POST call saveNote');
        const note = NotesController.parseNote(req.body);
        this.notesService.saveNote(note).then(id => {
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
