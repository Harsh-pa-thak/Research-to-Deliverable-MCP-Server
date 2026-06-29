import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function sumCont(data) {
    const { title, headings, bodyText, url } = data;

    const prompt = `
        You are a professional research assistant. Read the following web page content and produce a clean, structured research document.
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
        `;
    const result = await model.generateContent(prompt);
    return result.response.text();

}