import 'reflect-metadata';

import express, {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {notesRouter} from './src/routes/notes.route';
import {HttpError} from "http-errors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('[ErrorHandler] error message:', error.message);
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    res.status(statusCode).send(error.message);
    next(error);
};

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Word!');
    res.sendStatus(200);
});

app.use('/api/v1/notes', notesRouter);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`[server] Server is running at: http://localhost:${port}`);
});
