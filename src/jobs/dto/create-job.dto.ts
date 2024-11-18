import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  title: string;

  @ApiProperty({ example: 'Tech Corp' })
  company: string;

  @ApiProperty({ example: 'We are looking for...' })
  description: string;

  @ApiProperty({ example: 'New York, NY' })
  location: string;

  @ApiProperty({ example: 'Technology' })
  industry: string;

  @ApiProperty({ example: 'Senior' })
  experienceLevel: string;

  @ApiProperty({ example: 'Full-time' })
  employmentType: string;

  @ApiProperty({ example: '$100,000 - $150,000' })
  salary: string;

  @ApiProperty({ example: ['5+ years experience', "Bachelor's degree"] })
  requirements: string[];

  @ApiProperty({ example: ['Lead team', 'Develop features'] })
  responsibilities: string[];

  @ApiProperty({ example: '2024-12-31' })
  deadline: Date;
}
