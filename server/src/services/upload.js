import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'Stream';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
export async function upload(pdfBuf, title = 'Research-Report') {
    const pubId = `research-pdfs/${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: pubId,
                resource_type: "raw",
                format: 'pdf',
            },

            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }

        );
        Readable.from(pdfBuf).pipe(uploadStream);
    })

}