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
import { JobMatchingService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from 'src/auth/auth-guard';

@Controller('jobs')
export class JobMatchingController {
  constructor(private readonly jobMatchingService: JobMatchingService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobMatchingService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobMatchingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobMatchingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobMatchingService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobMatchingService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('matching/me')
  findMatchingJobs(@Request() req) {
    return this.jobMatchingService.findMatchingJobs(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  applyForJob(@Param('id') id: string, @Request() req) {
    return this.jobMatchingService.applyForJob(id, req.user);
  }
}
