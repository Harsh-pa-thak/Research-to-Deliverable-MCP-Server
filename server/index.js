import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to mongodb');
}).catch((error) => {
    console.log(error);
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
