import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GenerateDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  text: string;

  @IsString()
  @IsOptional()
  @IsIn(['fr', 'en', 'ar'])
  language?: string;
}
