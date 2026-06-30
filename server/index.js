import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import research from './src/routes/research.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());


app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));


app.use('/api/research', research);

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Research server is running' });
});


process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
