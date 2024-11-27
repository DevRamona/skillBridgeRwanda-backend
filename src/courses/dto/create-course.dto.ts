import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to React' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn React fundamentals' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ example: '60d5ec49f1b2c8b1f8c8e8e8', required: true }) // Example ObjectId
  @IsString()
  @IsNotEmpty()
  learningPathId: string;

  @ApiProperty({ example: 'Beginner', required: true })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 'John Doe', required: true })
  @IsString()
  @IsNotEmpty()
  instructor: string;
}
