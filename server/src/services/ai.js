import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function sumCont(data) {
    const { title, headings, bodyText, url } = data;

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',   // best free model on Groq
        messages: [
            {
                role: 'system',
                content: 'You are a professional research assistant. Produce clean, structured research documents from web content.',
            },
            {
                role: 'user',
                content: `
SOURCE: ${url}
TITLE: ${title}
HEADINGS: ${headings.slice(0, 15).join(' | ')}

FULL CONTENT:
${bodyText}

---

Write a structured research summary with exactly these sections:

# ${title}

## Overview
(2–3 sentences: what is this page/topic about?)

## Key Points
(6–8 bullet points of the most important facts or ideas)

## In Depth
(2–3 short paragraphs expanding on the key points)

## Takeaway
(1 sentence: the single most important thing to remember)

## Source
- URL: ${url}
- Scraped: ${new Date().toLocaleDateString()}
`,
            },
        ],
        temperature: 0.3,    // lower = more factual, less creative
        max_tokens: 2048,
    });

    return response.choices[0].message.content;
}
