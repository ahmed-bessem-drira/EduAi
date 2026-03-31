/// <reference types="multer" />
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadPDF(file: Express.Multer.File): Promise<{
        text: string;
    }>;
}
