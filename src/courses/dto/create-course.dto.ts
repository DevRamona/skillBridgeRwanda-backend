import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to React' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn the fundamentals of React.js' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ example: 'uuid-of-learning-path', required: false })
  @IsString()
  @IsOptional()
  learningPathId?: string;
}
