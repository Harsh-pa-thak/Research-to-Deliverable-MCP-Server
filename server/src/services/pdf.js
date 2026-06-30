import puppeteer from "puppeteer";
import { marked } from "marked";

export async function createPdf(content, title = "Research Report") {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'
            ]
        });
        const page = await browser.newPage();
        const bodyHtml = marked(content);

        const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.7;
            color: #1a1a1a;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 50px;
          }
          h1 { font-size: 26px; color: #111; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
          h2 { font-size: 18px; color: #333; margin-top: 28px; }
          h3 { font-size: 15px; color: #444; }
          ul { padding-left: 20px; }
          li { margin-bottom: 6px; }
          p  { margin: 10px 0; }
          strong { color: #111; }
          hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
          a  { color: #2563eb; }
        </style>
      </head>
      <body>${bodyHtml}</body>
      </html>
    `;
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        const pdfBuf = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '15mm',
                right: '15mm'
            },
            printBackground: true,
        });
        return pdfBuf;


    }
    finally {
        if (browser) await browser.close();
    }
}