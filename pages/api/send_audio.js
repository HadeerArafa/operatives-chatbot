// pages/api/upload-audio.js

import fs from 'fs';
import path from 'path';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: {
        bodyParser: false, // Disable built-in bodyParser to use multer
    },
};

export default async function handler(req, res) {
    try {
        // Use the upload middleware to handle the audio file
        await upload.single('audio')(req, res);

        // Access the uploaded audio file from req.file.buffer
        
        const audioBuffer = req.file.buffer;

        // Specify the directory to save the audio file
        const uploadDir = path.join(process.cwd()); // Adjust the directory as needed

        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Generate a unique filename (e.g., using timestamp)
        const fileName = `audio_${Date.now()}.webm`;

        // Create the full path to save the file
        const filePath = path.join(uploadDir, fileName);

        // Write the audio buffer to the file
        fs.writeFileSync(filePath, audioBuffer);


        res.status(200).json({ message: 'Audio upload successful' });
    } catch (error) {
        console.error('Error handling audio upload:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
