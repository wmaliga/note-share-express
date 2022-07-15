import express from 'express';

import NotesController from '../controllers/notes.controller';

export const notesRouter = express.Router();

notesRouter.get('/', NotesController.findPublicNotes);
notesRouter.get('/:id/type', NotesController.getNoteType);
notesRouter.post('/', NotesController.saveNote);
