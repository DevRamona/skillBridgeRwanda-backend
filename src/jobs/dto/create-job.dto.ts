import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredSkills: string[];

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @IsString()
  @IsNotEmpty()
  employmentType: string;

  @IsNumber()
  @IsNotEmpty()
  salaryRange: number;

  @IsString()
  @IsNotEmpty()
  industry: string;
}
