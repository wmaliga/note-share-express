import express, {Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Word!');
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`[server] Server is running at: http://localhost:${port}`);
});
