import { AiService } from './ai.service';
import { GenerateDto } from './dto/generate.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(generateDto: GenerateDto): Promise<any>;
}
