import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from 'src/auth/auth-guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Return all jobs.' })
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Return the job.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a job' })
  @ApiResponse({ status: 200, description: 'Job successfully updated.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiResponse({ status: 200, description: 'Job successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Post(':id/apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 200, description: 'Successfully applied for job.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  apply(@Param('id') id: string, @Request() req) {
    return this.jobsService.applyForJob(id, req.user);
  }

  @Get('matching/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get matching jobs for current user' })
  @ApiResponse({ status: 200, description: 'Return matching jobs.' })
  getMatchingJobs(@Request() req) {
    return this.jobsService.findMatchingJobs(req.user);
  }
}
