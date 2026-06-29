import express from 'express'
import { fetchAndExtract } from '../services/scraper.js'
import { sumCont } from '../services/ai.js'

const router = express.Router();

router.post('/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const result = await fetchAndExtract(url);
        const summery = await sumCont(result);
        res.json({ success: true, value: summery });
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" })
    }

});
export default router;
