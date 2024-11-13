import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLearningPathDto {
  @ApiProperty({ example: 'Full Stack Development Path' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Comprehensive path to become a full stack developer',
  })
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

  @ApiProperty({ example: ['JavaScript', 'HTML', 'CSS'] })
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @ApiProperty({
    example: ['Build full-stack applications', 'Deploy web applications'],
  })
  @IsArray()
  @IsString({ each: true })
  outcomes: string[];

  @ApiProperty({ example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  popularity?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  rating?: number;
}
