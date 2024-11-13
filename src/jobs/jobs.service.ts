import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './schemas/job.schema';
import { User } from '../users/schemas/user.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobMatchingService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(createJobDto);
    return await this.jobRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return await this.jobRepository.find();
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['applicants'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return await this.jobRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async findMatchingJobs(user: User): Promise<Job[]> {
    const jobs = await this.jobRepository.find();

    // Calculate match score for each job
    const scoredJobs = jobs.map((job) => ({
      job,
      score: this.calculateMatchScore(user, job),
    }));

    // Sort by score descending and return jobs
    return scoredJobs
      .sort((a, b) => b.score - a.score)
      .map((scoredJob) => scoredJob.job);
  }

  private calculateMatchScore(user: User, job: Job): number {
    let score = 0;

    // Match required skills
    const userSkills = new Set(user.skills);
    job.requiredSkills.forEach((skill) => {
      if (userSkills.has(skill)) {
        score += 2;
      }
    });

    // Match preferred skills
    job.preferredSkills.forEach((skill) => {
      if (userSkills.has(skill)) {
        score += 1;
      }
    });

    // Match industry
    if (user.industry === job.industry) {
      score += 2;
    }

    // Match experience level
    if (user.experienceLevel === job.experienceLevel) {
      score += 1;
    }

    return score;
  }

  async applyForJob(jobId: string, user: User): Promise<Job> {
    const job = await this.findOne(jobId);

    if (!job.applicants) {
      job.applicants = [];
    }

    // Check if user already applied
    const alreadyApplied = job.applicants.some(
      (applicant) => applicant.id === user.id,
    );
    if (!alreadyApplied) {
      job.applicants.push(user);
      await this.jobRepository.save(job);
    }

    return job;
  }
}
