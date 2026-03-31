import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');

@Injectable()
export class UploadService {
  async extractTextFromPDF(file: any): Promise<{ text: string }> {
    try {
      console.log('Starting PDF extraction for file:', file.originalname);
      console.log('File path:', file.path);
      console.log('File size:', file.size);
      console.log('File mimetype:', file.mimetype);
      
      const filePath = file.path;
      
      if (!fs.existsSync(filePath)) {
        console.error('File not found at path:', filePath);
        throw new InternalServerErrorException('File not found after upload');
      }

      console.log('Reading file from disk...');
      const dataBuffer = fs.readFileSync(filePath);
      console.log('File buffer size:', dataBuffer.length);
      
      // Vérifier si le fichier commence bien par %PDF (signature PDF)
      const header = dataBuffer.slice(0, 4).toString();
      if (header !== '%PDF') {
        throw new Error('Invalid PDF file format');
      }
      
      console.log('PDF validation successful');
      
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      console.log('Temporary file cleaned up');

      // Extraire le texte du PDF à l'aide de pdf-parse
      const baseOptions = { max: 0 };
      const parsedData = await pdf(dataBuffer, baseOptions);
      const extractedText = parsedData.text;
      
      console.log(`Successfully extracted ${extractedText.length} characters from ${file.originalname}`);

      // Retourner le texte extrait
      return {
        text: extractedText,
      };
    } catch (error) {
      console.error('PDF Processing Error:', error);
      console.error('Error stack:', error.stack);
      
      // Clean up file if it exists
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
          console.log('Temporary file cleaned up after error');
        } catch (cleanupError) {
          console.error('Failed to clean up temporary file:', cleanupError);
        }
      }

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to process PDF file. Please ensure the file is a valid PDF document.'
      );
    }
  }
}
