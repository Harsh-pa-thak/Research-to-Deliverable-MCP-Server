import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.join(__dirname, '../../public/pdfs');

// Create folder if it doesn't exist
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

export async function upload(pdfBuf, title = 'Research-Report') {
    const filename = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
    const filepath = path.join(PDF_DIR, filename);

    fs.writeFileSync(filepath, Buffer.from(pdfBuf));

    return `http://localhost:3000/pdfs/${filename}`;
}
