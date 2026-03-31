import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';

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

      // Pour l'instant, retourner les informations de base sur le PDF
      return {
        text: `PDF uploaded successfully! File: ${file.originalname}, Size: ${(file.size / 1024).toFixed(2)} KB, Type: ${file.mimetype}. Text extraction will be available soon.`,
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
