import fetch from "node-fetch";
import * as cheerio from 'cheerio';

export async function fetchAndExtract(url) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/[IP_ADDRESS] Safari/537.36",
        },
        signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
        console.log(res.statusText + "  status code -> " + res.status);
        throw new Error('Failed to fetch');
    }
    const html = await res.text();

    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, aside, iframe, noscript, ads').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim();
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
    $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 40) paragraphs.push(text);
    });

    const bodyText = paragraphs.join('\n\n');

    return {
        url,
        title,
        description,
        headings,
        bodyText,
        wordCount: bodyText.split(/\s+/).length,
        fetchedAt: new Date().toISOString(),
    };
}