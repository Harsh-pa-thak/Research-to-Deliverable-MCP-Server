import express from 'express'
import { fetchAndExtract } from '../services/scraper.js'

const router = express.Router();

router.post('/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const result = await fetchAndExtract(url);
        res.json({ success: true, value: result });
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" })
    }

});
export default router;
