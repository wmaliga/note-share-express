import NotesRepository from '../repositories/notes.repository';
import NotesService from './notes.service';
import PasswordUtil from '../utils/password.util';
import {Note, NoteType} from "../models/notes.model";

jest.mock('../repositories/notes.repository');
jest.mock('../utils/password.util');

const notesRepository = Object.create(NotesRepository.prototype);
const passwordUtil = Object.create(PasswordUtil.prototype);
const notesService = new NotesService(notesRepository, passwordUtil);

const password = 'pass';
const todayDate = new Date();
const tomorrowDate = new Date();
tomorrowDate.setDate(todayDate.getDate() + 1);
const testNote = {
    id: 'id1',
    type: NoteType.PUBLIC,
    expirationDate: tomorrowDate
} as Note;
const testNotes = [testNote];

describe('Notes service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('findPublicNotes success', async () => {
        notesRepository.findPublicNotes.mockReturnValue(Promise.resolve(testNotes));

        const notes = await notesService.findPublicNotes();

        expect(notesRepository.findPublicNotes).toHaveBeenCalled();
        expect(notes).toEqual(testNotes);
    });

    test('getNoteType success', async () => {
        notesRepository.getNoteType.mockReturnValue(Promise.resolve(NoteType.PRIVATE));

        const type = await notesService.getNoteType(testNote.id);

        expect(notesRepository.getNoteType).toHaveBeenCalledWith(testNote.id);
        expect(type).toEqual(NoteType.PRIVATE);
    });

    test('getNote public note', async () => {
        notesRepository.getNote.mockReturnValue(Promise.resolve(testNote));
        passwordUtil.encrypt.mockReturnValue(password);

        const note = await notesService.getNote(testNote.id, password);

        expect(notesRepository.getNote).toHaveBeenCalledWith(testNote.id);
        expect(note).toEqual(testNote);
    });

    test('getNote private note', async () => {
        const privateNote = {
            ...testNote,
            type: NoteType.PRIVATE,
            password: password
        };

        notesRepository.getNote.mockReturnValue(Promise.resolve(privateNote));
        passwordUtil.encrypt.mockReturnValue(password);

        const note = await notesService.getNote(testNote.id, password);

        expect(notesRepository.getNote).toHaveBeenCalledWith(testNote.id);
        expect(note).toEqual(privateNote);
    });

    test('getNote note expired', async () => {
        const expiredNote = {
            ...testNote,
            expirationDate: todayDate
        }

        notesRepository.getNote.mockReturnValue(Promise.resolve(expiredNote));
        passwordUtil.encrypt.mockReturnValue(password);

        expect(() => notesService.getNote(testNote.id, password)).rejects.toThrowError('Note expired');
    });

    test('getNote incorrect password', async () => {
        const privateNote = {
            ...testNote,
            type: NoteType.PRIVATE,
            password: 'incorrect'
        }

        notesRepository.getNote.mockReturnValue(Promise.resolve(privateNote));
        passwordUtil.encrypt.mockReturnValue(password);

        expect(() => notesService.getNote(testNote.id, password)).rejects.toThrowError('Unauthorized');
    });

    test('saveNote public note', async () => {
        notesRepository.saveNote.mockReturnValue(Promise.resolve(testNote.id));
        passwordUtil.encrypt.mockReturnValue(password);

        const createdId = await notesService.saveNote(testNote);

        expect(notesRepository.saveNote).toHaveBeenCalledWith(testNote);
        expect(createdId).toEqual(testNote.id);
    });

    test('saveNote private note', async () => {
        const privateNote = {
            ...testNote,
            type: NoteType.PRIVATE,
            password: password
        }

        notesRepository.saveNote.mockReturnValue(Promise.resolve(privateNote.id));
        passwordUtil.encrypt.mockReturnValue(password);

        const createdId = await notesService.saveNote(privateNote);

        expect(notesRepository.saveNote).toHaveBeenCalledWith(privateNote);
        expect(createdId).toEqual(privateNote.id);
    });

    test('saveNote expired note', async () => {
        const expiredNote = {
            ...testNote,
            expirationDate: todayDate
        }

        notesRepository.saveNote.mockReturnValue(Promise.resolve(expiredNote.id));
        passwordUtil.encrypt.mockReturnValue(password);

        expect(() => notesService.saveNote(expiredNote)).rejects.toThrowError('Expiration date cannot be in the past');
        expect(notesRepository.saveNote).not.toHaveBeenCalled();
    });

    test('saveNote missing password', async () => {
        const privateNote = {
            ...testNote,
            type: NoteType.PRIVATE,
            password: ''
        }

        notesRepository.saveNote.mockReturnValue(Promise.resolve(privateNote.id));
        passwordUtil.encrypt.mockReturnValue(password);

        expect(() => notesService.saveNote(privateNote)).rejects.toThrowError('Missing password for private note');
        expect(notesRepository.saveNote).not.toHaveBeenCalled();
    });
});
