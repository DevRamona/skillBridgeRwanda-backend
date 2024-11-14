import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().populate('applicants', '-password').exec();
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobModel
      .findById(id)
      .populate('applicants', '-password')
      .exec();
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const updatedJob = await this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .populate('applicants', '-password')
      .exec();

    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return updatedJob;
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async applyForJob(jobId: string, user: User): Promise<Job> {
    const job = await this.findOne(jobId);

    const alreadyApplied = job.applicants?.some(
      (applicant) => applicant.id.toString() === user.id.toString(),
    );

    if (alreadyApplied) {
      return job;
    }

    return this.jobModel
      .findByIdAndUpdate(
        jobId,
        { $push: { applicants: user.id } },
        { new: true },
      )
      .populate('applicants', '-password')
      .exec();
  }

  async findMatchingJobs(user: User): Promise<Job[]> {
    const jobs = await this.findAll();

    return jobs
      .map((job) => ({
        job,
        score: this.calculateMatchScore(user, job),
      }))
      .sort((a, b) => b.score - a.score)
      .map((scoredJob) => scoredJob.job);
  }

  private calculateMatchScore(user: User, job: Job): number {
    let score = 0;

    // Match required skills
    const userSkills = new Set(user.skills || []);
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
}
