import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { fetchAndExtract } from './src/services/scraper.js';
const result = await fetchAndExtract('https://www.moneycontrol.com/technology/apple-iphone-18-pro-and-iphone-18-pro-max-launching-soon-here-s-everything-from-design-changes-to-display-and-camera-upgrdes-we-know-about-article-13960571.html');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(result.bodyText);
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to mongodb');
}).catch((error) => {
    console.log(error);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
