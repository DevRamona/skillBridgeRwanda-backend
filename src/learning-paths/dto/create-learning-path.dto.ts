import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLearningPathDto {
  @ApiProperty({ example: 'Full Stack Development' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Complete path to become a full stack developer' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Intermediate' })
  @IsString()
  @IsNotEmpty()
  skillLevel: string;

  @ApiProperty({ example: '6 months' })
  @IsString()
  @IsNotEmpty()
  estimatedDuration: string;

  @ApiProperty({ example: 'Web Development' })
  @IsString()
  @IsNotEmpty()
  careerTrack: string;

  @ApiProperty({ example: ['JavaScript', 'React', 'Node.js'] })
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @ApiProperty({
    example: ['Build full stack applications', 'Deploy web apps'],
  })
  @IsArray()
  @IsString({ each: true })
  outcomes: string[];

  @ApiProperty({ example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  courses?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  popularity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;
}
