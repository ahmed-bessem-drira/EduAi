"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let AiService = class AiService {
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GROQ_API_KEY');
        const baseURL = this.configService.get('GROQ_BASE_URL');
        if (!apiKey) {
            throw new Error('GROQ_API_KEY is not configured');
        }
        this.groq = new groq_sdk_1.Groq({
            apiKey,
            baseURL: baseURL || undefined
        });
    }
    async generateContent(generateDto) {
        const { text, language = 'fr' } = generateDto;
        const langLabel = language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English';
        const systemPrompt = `You are an expert educational content analyzer.
Your task is to analyze the provided course content and generate structured educational materials.
You MUST respond ONLY with valid JSON, no markdown, no explanation, no preamble.
The JSON must strictly follow the schema provided.
Language for all content: ${langLabel}.`;
        const userPrompt = `Analyze this course content and return a JSON object with EXACTLY this structure (no extra fields):
{
  "resume": {
    "introduction": "2-3 sentence introduction to the topic",
    "explication_detaillee": "A rich and detailed paragraph explaining the core concepts of the course in depth",
    "points_cles": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
    "definitions": [{"terme": "term", "definition": "clear definition"}],
    "conclusion": "2-3 sentence conclusion"
  },
  "qcm": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A) option", "B) option", "C) option", "D) option"],
      "reponse": "A",
      "explication": "Explanation of why A is correct",
      "difficulte": "facile"
    }
  ],
  "questions_ouvertes": [
    {
      "id": 1,
      "question": "Open question text?",
      "corrige": "Model answer",
      "difficulte": "facile"
    }
  ]
}

Rules:
- qcm must contain exactly 10 questions
- questions_ouvertes must contain exactly 5 questions
- options must always be an array of 4 strings
- reponse must be one of: "A", "B", "C", "D"
- difficulte must be one of: "facile", "moyen", "difficile"

Course content:
${text}`;
        try {
            const modelName = this.configService.get('AI_MODEL') || 'llama-3.3-70b-versatile';
            const response = await this.groq.chat.completions.create({
                model: modelName,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 8192,
                temperature: 0.2,
                top_p: 0.9,
                response_format: { type: 'json_object' },
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new common_1.InternalServerErrorException('No content received from AI');
            }
            console.log('AI response length:', content.length);
            console.log('First 300 chars:', content.substring(0, 300));
            let cleaned = content.trim();
            cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
            let parsed;
            try {
                parsed = JSON.parse(cleaned);
                console.log('JSON parsed OK');
            }
            catch (e) {
                console.error('JSON parse error:', e.message);
                console.error('Raw content:', cleaned.substring(0, 500));
                throw new common_1.InternalServerErrorException('AI returned invalid JSON. Please try again.');
            }
            const validated = this.validateAndNormalise(parsed);
            return validated;
        }
        catch (error) {
            console.error('AI Service Error:', error.message || error);
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to generate content. Please try again later.');
        }
    }
    validateAndNormalise(response) {
        if (!response || typeof response !== 'object') {
            throw new common_1.InternalServerErrorException('Invalid response format from AI');
        }
        if (!response.resume) {
            throw new common_1.InternalServerErrorException('Missing "resume" field');
        }
        const resume = response.resume;
        if (!resume.introduction || !resume.conclusion || !resume.explication_detaillee) {
            throw new common_1.InternalServerErrorException('Resume is missing introduction, conclusion, or explication_detaillee');
        }
        if (!Array.isArray(resume.points_cles) || resume.points_cles.length === 0) {
            throw new common_1.InternalServerErrorException('Resume must have points_cles array');
        }
        if (!Array.isArray(resume.definitions)) {
            resume.definitions = [];
        }
        if (!Array.isArray(response.qcm) || response.qcm.length === 0) {
            throw new common_1.InternalServerErrorException('QCM array is missing or empty');
        }
        const qcm = response.qcm.map((q, i) => {
            let options = q.options;
            if (!Array.isArray(options) && typeof options === 'object') {
                const obj = options;
                options = [obj.A, obj.B, obj.C, obj.D];
            }
            if (!Array.isArray(options) || options.length !== 4) {
                throw new common_1.InternalServerErrorException(`QCM question ${i + 1} has invalid options`);
            }
            if (!q.question || !q.reponse || !q.explication || !q.difficulte) {
                throw new common_1.InternalServerErrorException(`QCM question ${i + 1} is missing required fields`);
            }
            return {
                id: q.id ?? i + 1,
                question: q.question,
                options,
                reponse: q.reponse,
                explication: q.explication,
                difficulte: q.difficulte,
            };
        });
        if (!Array.isArray(response.questions_ouvertes) ||
            response.questions_ouvertes.length === 0) {
            throw new common_1.InternalServerErrorException('questions_ouvertes array is missing or empty');
        }
        const questions_ouvertes = response.questions_ouvertes.map((q, i) => {
            if (!q.question || !q.corrige || !q.difficulte) {
                throw new common_1.InternalServerErrorException(`Open question ${i + 1} is missing required fields`);
            }
            return {
                id: q.id ?? i + 1,
                question: q.question,
                corrige: q.corrige,
                difficulte: q.difficulte,
            };
        });
        console.log(`Validation OK — ${qcm.length} QCM, ${questions_ouvertes.length} open questions`);
        return { resume, qcm, questions_ouvertes };
    }
};
AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
exports.AiService = AiService;
//# sourceMappingURL=ai.service.js.map