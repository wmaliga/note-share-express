import {NextFunction, Request, Response} from 'express';

import NotesController from './notes.controller';
import NotesService from '../services/notes.service';
import {Note, NoteType} from '../models/notes.model';

jest.mock('../services/notes.service');

const notesServiceMock = Object.create(NotesService.prototype);
const notesController = new NotesController(notesServiceMock);

const testNote = {
    id: 'id1',
    password: 'pass'
} as Note;
const testNotes = [testNote];

function mockReq(): Request {
    const req = {
        body: {},
        get: jest.fn()
    }
    req.get.mockReturnValue('header');
    return req as unknown as Request;
}

function mockRes(): Response {
    const res = {
        params: {},
        get: jest.fn(),
        set: jest.fn(),
        status: jest.fn(),
        json: jest.fn()
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res as unknown as Response;
}

describe('Notes controller', () => {
    test('findPublicNotes success', async () => {
        notesServiceMock.findPublicNotes.mockReturnValue(Promise.resolve(testNotes));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        await notesController.findPublicNotes(req, res, next);

        expect(notesServiceMock.findPublicNotes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([{id: 'id1'}]));
    });

    test('findPublicNotes error', async () => {
        notesServiceMock.findPublicNotes.mockReturnValue(Promise.reject('error'));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        await notesController.findPublicNotes(req, res, next);

        expect(notesServiceMock.findPublicNotes).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('getNoteType success', async () => {
        notesServiceMock.getNoteType.mockReturnValue(Promise.resolve(NoteType.PRIVATE));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.params = {id: testNote.id};

        await notesController.getNoteType(req, res, next);

        expect(notesServiceMock.getNoteType).toHaveBeenCalledWith(testNote.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(NoteType.PRIVATE);
    });

    test('getNoteType error', async () => {
        notesServiceMock.getNoteType.mockReturnValue(Promise.reject('error'));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.params = {id: testNote.id};

        await notesController.getNoteType(req, res, next);

        expect(notesServiceMock.getNoteType).toHaveBeenCalledWith(testNote.id);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('getNote success', async () => {
        notesServiceMock.getNote.mockReturnValue(Promise.resolve(testNote));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.params = {id: testNote.id};

        await notesController.getNote(req, res, next);

        expect(notesServiceMock.getNote).toHaveBeenCalledWith(testNote.id, 'header');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({id: 'id1'});
    });

    test('getNote error', async () => {
        notesServiceMock.getNote.mockReturnValue(Promise.reject('error'));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.params = {id: testNote.id};

        await notesController.getNote(req, res, next);

        expect(notesServiceMock.getNote).toHaveBeenCalledWith(testNote.id, 'header');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('saveNote success', async () => {
        notesServiceMock.saveNote.mockReturnValue(Promise.resolve(testNote.id));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.body = testNote;

        await notesController.saveNote(req, res, next);

        expect(notesServiceMock.saveNote).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.set).toHaveBeenCalledWith('Location', testNote.id);
    });

    test('saveNote error', async () => {
        notesServiceMock.saveNote.mockReturnValue(Promise.reject('error'));

        const req = mockReq();
        const res = mockRes();
        const next = jest.fn() as NextFunction;

        req.body = testNote;

        await notesController.saveNote(req, res, next);

        expect(notesServiceMock.saveNote).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.set).not.toHaveBeenCalled();
    });
});
