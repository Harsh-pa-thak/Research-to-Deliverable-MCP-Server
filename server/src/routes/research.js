import express from 'express'
import { fetchAndExtract } from '../services/scraper.js'
import { sumCont } from '../services/ai.js'
import { createPdf } from '../services/pdf.js';
import { upload } from '../services/upload.js';

const router = express.Router();

router.post('/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const result = await fetchAndExtract(url);
        const summery = await sumCont(result);
        const pdf = await createPdf(summery, result.title)
        const pdfUrl = await upload(pdf, result.title)
        res.json({
            success: true,
            data: {
                url: result.url,
                title: result.title,
                pdfUrl,
                summary: summery,
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" })
    }

});
export default router;
