import { ConfigService } from '@nestjs/config';
import { GenerateDto } from './dto/generate.dto';
export declare class AiService {
    private configService;
    private readonly groq;
    constructor(configService: ConfigService);
    generateContent(generateDto: GenerateDto): Promise<any>;
    private validateAndNormalise;
}
