import express from 'express';

import NotesController from '../controllers/notes.controller';

export const notesRouter = express.Router();

notesRouter.post('/', NotesController.saveNote);
