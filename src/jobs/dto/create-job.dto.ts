import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Looking for an experienced software engineer to join our team',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Tech Company Inc.' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'New York, NY' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: ['JavaScript', 'React', 'Node.js'] })
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @ApiProperty({
    example: ['TypeScript', 'AWS'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredSkills: string[];

  @ApiProperty({ example: 'Senior' })
  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @ApiProperty({ example: 'Full-time' })
  @IsString()
  @IsNotEmpty()
  employmentType: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @IsNotEmpty()
  salaryRange: number;

  @ApiProperty({ example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  industry: string;
}
