import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'student',
    enum: ['student', 'employer', 'educator', 'admin'],
    default: 'student',
  })
  @IsEnum(['student', 'employer', 'educator', 'admin'])
  role: string;

  @ApiProperty({
    example: ['JavaScript', 'React'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    example: {
      education: 'Bachelor in Computer Science',
      experience: '5 years',
      certifications: ['AWS Certified Developer'],
    },
    required: false,
  })
  @IsOptional()
  profile?: {
    education: string;
    experience: string;
    certifications: string[];
  };
}
