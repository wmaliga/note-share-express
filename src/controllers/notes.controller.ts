import {NextFunction, Request, Response} from "express";
import {Service} from "typedi";
import {body, validationResult} from "express-validator";

import {Note, NoteType} from "../models/notes.model";
import NotesService from "../services/notes.service";

export const noteValidator = [
    body('type').not().isEmpty().isIn(Object.values(NoteType)),
    body('title').not().isEmpty(),
    body('expirationDate').not().isEmpty().isISO8601().toDate(),
    body('data').not().isEmpty()
];

@Service()
export default class NotesController {
    constructor(
        public notesService: NotesService
    ) {
    }

    async findPublicNotes(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] GET call findPublicNotes');
        this.notesService.findPublicNotes().then(notes => {
            const notesData = notes.map(note => NotesController.deleteSensitiveData(note));
            res.status(200).json(notesData);
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
            const noteData = NotesController.deleteSensitiveData(note);
            res.status(200).json(noteData);
        }).catch(next);
    }

    async saveNote(req: Request, res: Response, next: NextFunction) {
        console.log('[NotesController] POST call saveNote');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

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

    static deleteSensitiveData(note: Note) {
        const noteData = {...note};
        delete noteData.password;
        return noteData;
    }
}
