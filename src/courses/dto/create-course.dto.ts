import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  learningPathId?: string;
}
