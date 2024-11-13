import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
    required: false,
  })
  @IsOptional()
  role?: string = 'student'; // Default value
}
