"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const pdf = require('pdf-parse');
let UploadService = class UploadService {
    async extractTextFromPDF(file) {
        try {
            console.log('Starting PDF extraction for file:', file.originalname);
            console.log('File path:', file.path);
            console.log('File size:', file.size);
            console.log('File mimetype:', file.mimetype);
            const filePath = file.path;
            if (!fs.existsSync(filePath)) {
                console.error('File not found at path:', filePath);
                throw new common_1.InternalServerErrorException('File not found after upload');
            }
            console.log('Reading file from disk...');
            const dataBuffer = fs.readFileSync(filePath);
            console.log('File buffer size:', dataBuffer.length);
            const header = dataBuffer.slice(0, 4).toString();
            if (header !== '%PDF') {
                throw new Error('Invalid PDF file format');
            }
            console.log('PDF validation successful');
            fs.unlinkSync(filePath);
            console.log('Temporary file cleaned up');
            const baseOptions = { max: 0 };
            const parsedData = await pdf(dataBuffer, baseOptions);
            const extractedText = parsedData.text;
            console.log(`Successfully extracted ${extractedText.length} characters from ${file.originalname}`);
            return {
                text: extractedText,
            };
        }
        catch (error) {
            console.error('PDF Processing Error:', error);
            console.error('Error stack:', error.stack);
            if (file.path && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                    console.log('Temporary file cleaned up after error');
                }
                catch (cleanupError) {
                    console.error('Failed to clean up temporary file:', cleanupError);
                }
            }
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to process PDF file. Please ensure the file is a valid PDF document.');
        }
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map