import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

export class CreateLearningPathDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  skillLevel: string;

  @IsString()
  estimatedDuration: string;

  @IsString()
  careerTrack: string;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsArray()
  @IsString({ each: true })
  outcomes: string[];

  @IsString()
  industry: string;

  @IsOptional()
  @IsArray()
  courseIds: string[];
}
