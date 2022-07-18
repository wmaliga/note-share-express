import express from 'express';

import NotesController from '../controllers/notes.controller';
import {Container} from "typedi";

const notesController = Container.get(NotesController);

export const notesRouter = express.Router();

notesRouter.get('/', (req, res, next) => notesController.findPublicNotes(req, res, next));
notesRouter.get('/:id/type', (req, res, next) => notesController.getNoteType(req, res, next));
notesRouter.get('/:id', (req, res, next) => notesController.getNote(req, res, next));
notesRouter.post('/', (req, res, next) => notesController.saveNote(req, res, next));
