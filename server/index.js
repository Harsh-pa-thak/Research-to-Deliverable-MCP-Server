import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import research from './src/routes/research.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/research', research);


app.get('/', (req, res) => {
    res.send("welcome to mini mcp server");
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to mongodb');
}).catch((error) => {
    console.log(error);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
