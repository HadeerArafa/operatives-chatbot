// pages/api/upload.js

import { IncomingForm } from 'formidable-serverless';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // Disabling the built-in bodyParser
  },
};

export default async function handler(req, res) {
  // Create a new formidable form parser
  const form = new IncomingForm();

  // Parse the incoming form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // Get the temporary path and original filename of the uploaded file
    const tempPath = files.file.path;
    const originalFilename = files.file.name;

    // Extract the file extension
    const fileExtension = path.extname(originalFilename);

    // Get the user_id from the form fields
    const user_id = fields.user_id;

    // Generate a unique ID for the image
    const image_id = uuidv4();

    // Specify the destination folder based on user_id
    const userFolder = path.join('./public/uploads/', user_id);

    // Create the user's folder if it doesn't exist
    await fs.ensureDir(userFolder);

    // Generate a unique filename using image_id, user_id, and the original file extension
    const uniqueFilename = `${image_id}_${user_id}${fileExtension}`;

    // Build the path to the new file within the user's folder
    const newPath = path.join(userFolder, uniqueFilename);

    try {
      // Move the file to the destination folder (overwrite if it already exists)
      await fs.move(tempPath, newPath, { overwrite: true });

      // Get the absolute path
      const absolutePath = path.resolve(newPath);

      // Respond with success message, file information, and the generated image_id
      res.status(200).json({
        message: 'File uploaded successfully',
        filename: uniqueFilename,
        image_id: image_id,
        img_path: absolutePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving the file' });
    }
  });
}
