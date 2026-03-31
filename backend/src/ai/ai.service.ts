import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { GenerateDto } from './dto/generate.dto';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const baseURL = this.configService.get<string>('GROQ_BASE_URL');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    this.groq = new Groq({ 
      apiKey, 
      baseURL: baseURL || undefined 
    });
  }

  async generateContent(generateDto: GenerateDto) {
    const { text, language = 'fr' } = generateDto;

    const langLabel =
      language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English';

    const systemPrompt = `You are an expert educational content analyzer.
Your task is to analyze the provided course content and generate structured educational materials.
You MUST respond ONLY with valid JSON, no markdown, no explanation, no preamble.
The JSON must strictly follow the schema provided.
Language for all content: ${langLabel}.`;

    const userPrompt = `Analyze this course content and return a JSON object with EXACTLY this structure (no extra fields):
{
  "resume": {
    "introduction": "2-3 sentence introduction to the topic",
    "points_cles": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
    "definitions": [{"terme": "term", "definition": "clear definition"}],
    "explications_etapes": [{"etape": "Name of the step/concept", "explication": "Detailed step-by-step explanation", "exemple": "Concrete small example"}],
    "points_a_retenir": ["takeaway 1", "takeaway 2", "takeaway 3"],
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
      const modelName = this.configService.get<string>('AI_MODEL') || 'llama-3.3-70b-versatile';
      
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
        throw new InternalServerErrorException('No content received from AI');
      }

      console.log('AI response length:', content.length);
      console.log('First 300 chars:', content.substring(0, 300));

      // Clean any stray markdown fences (shouldn't happen with json_object mode)
      let cleaned = content.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

      let parsed: any;
      try {
        parsed = JSON.parse(cleaned);
        console.log('JSON parsed OK');
      } catch (e) {
        console.error('JSON parse error:', e.message);
        console.error('Raw content:', cleaned.substring(0, 500));
        throw new InternalServerErrorException(
          'AI returned invalid JSON. Please try again.',
        );
      }

      const validated = this.validateAndNormalise(parsed);
      return validated;
    } catch (error) {
      console.error('AI Service Error:', error.message || error);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to generate content. Please try again later.',
      );
    }
  }

  private validateAndNormalise(response: any): any {
    if (!response || typeof response !== 'object') {
      throw new InternalServerErrorException('Invalid response format from AI');
    }

    // ── Resume ──────────────────────────────────────────────────────────────
    if (!response.resume) {
      throw new InternalServerErrorException('Missing "resume" field');
    }

    const resume = response.resume;
    if (!resume.introduction || !resume.conclusion) {
      throw new InternalServerErrorException(
        'Resume is missing introduction or conclusion',
      );
    }
    if (!Array.isArray(resume.points_cles) || resume.points_cles.length === 0) {
      throw new InternalServerErrorException('Resume must have points_cles array');
    }
    if (!Array.isArray(resume.explications_etapes) || resume.explications_etapes.length === 0) {
      throw new InternalServerErrorException('Resume must have explications_etapes array');
    }
    if (!Array.isArray(resume.points_a_retenir) || resume.points_a_retenir.length === 0) {
      throw new InternalServerErrorException('Resume must have points_a_retenir array');
    }
    if (!Array.isArray(resume.definitions)) {
      resume.definitions = [];
    }

    // ── QCM ─────────────────────────────────────────────────────────────────
    if (!Array.isArray(response.qcm) || response.qcm.length === 0) {
      throw new InternalServerErrorException('QCM array is missing or empty');
    }

    const qcm = response.qcm.map((q: any, i: number) => {
      // Normalise options: accept object {A,B,C,D} or array
      let options: string[] = q.options;
      if (!Array.isArray(options) && typeof options === 'object') {
        const obj = options as any;
        options = [obj.A, obj.B, obj.C, obj.D];
      }
      if (!Array.isArray(options) || options.length !== 4) {
        throw new InternalServerErrorException(
          `QCM question ${i + 1} has invalid options`,
        );
      }

      if (!q.question || !q.reponse || !q.explication || !q.difficulte) {
        throw new InternalServerErrorException(
          `QCM question ${i + 1} is missing required fields`,
        );
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

    // ── Questions ouvertes ───────────────────────────────────────────────────
    if (
      !Array.isArray(response.questions_ouvertes) ||
      response.questions_ouvertes.length === 0
    ) {
      throw new InternalServerErrorException(
        'questions_ouvertes array is missing or empty',
      );
    }

    const questions_ouvertes = response.questions_ouvertes.map(
      (q: any, i: number) => {
        if (!q.question || !q.corrige || !q.difficulte) {
          throw new InternalServerErrorException(
            `Open question ${i + 1} is missing required fields`,
          );
        }
        return {
          id: q.id ?? i + 1,
          question: q.question,
          corrige: q.corrige,
          difficulte: q.difficulte,
        };
      },
    );

    console.log(
      `Validation OK — ${qcm.length} QCM, ${questions_ouvertes.length} open questions`,
    );

    return { resume, qcm, questions_ouvertes };
  }
}
