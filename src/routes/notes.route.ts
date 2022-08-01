import express, {NextFunction, Request, Response} from 'express';

import NotesController, {noteValidator} from '../controllers/notes.controller';
import {Container} from 'typedi';

const notesController = Container.get(NotesController);

export const notesRouter = express.Router();

notesRouter.get('/', (req: Request, res: Response, next: NextFunction) => notesController.findPublicNotes(req, res, next));
notesRouter.get('/:id/type', (req: Request, res: Response, next: NextFunction) => notesController.getNoteType(req, res, next));
notesRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => notesController.getNote(req, res, next));
notesRouter.post('/', noteValidator, (req: Request, res: Response, next: NextFunction) => notesController.saveNote(req, res, next));
