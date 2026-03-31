import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateDto } from './dto/generate.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body() generateDto: GenerateDto) {
    return this.aiService.generateContent(generateDto);
  }
}
