import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function extractFromHtml(html, url) {
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, aside, iframe, noscript, [class*="ad-"], [id*="ad-"]').remove();

    const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text().trim() ||
        $('h1').first().text().trim() ||
        '';

    const description =
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        '';

    const headings = [];
    $('h1, h2, h3').each((_, el) => {
        const text = $(el).text().trim();
        if (text) headings.push(text);
    });

    const paragraphs = [];
    $('p, li, td, pre, code, blockquote, article').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) paragraphs.push(text);
    });

    const bodyText = [...new Set(paragraphs)].join('\n\n');

    return {
        url,
        title,
        description,
        headings,
        bodyText,
        wordCount: bodyText.split(/\s+/).filter(Boolean).length,
        fetchedAt: new Date().toISOString(),
    };
}

async function scrapeWithFetch(url) {
    const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const html = await res.text();
    return extractFromHtml(html, url);
}

async function scrapeWithPuppeteer(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });

        const page = await browser.newPage();

        await page.setUserAgent(USER_AGENT);
        await page.setViewport({ width: 1280, height: 800 });

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'media', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
        });

        await new Promise((r) => setTimeout(r, 1500));

        const html = await page.content();
        return extractFromHtml(html, url);
    } finally {
        if (browser) await browser.close();
    }
}

export async function fetchAndExtract(url) {
    console.log(`[scraper] Fetching: ${url}`);

    try {
        const result = await scrapeWithFetch(url);

        if (result.wordCount >= 150) {
            console.log(`[scraper]  Fast path succeeded (${result.wordCount} words)`);
            return { ...result, method: 'fetch' };
        }

        console.log(`[scraper] Too little content (${result.wordCount} words) — switching to Puppeteer`);
    } catch (err) {
        console.log(`[scraper] Fast path failed (${err.message}) — switching to Puppeteer`);
    }

    const result = await scrapeWithPuppeteer(url);
    console.log(`[scraper]  Puppeteer path succeeded (${result.wordCount} words)`);
    return { ...result, method: 'puppeteer' };
}
