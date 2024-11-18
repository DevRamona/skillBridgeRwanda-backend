import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  [x: string]: any;
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = await this.jobModel.create(createJobDto);
    return createdJob;
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
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const updatedJob = await this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .populate('applicants', '-password')
      .exec();

    if (!updatedJob) {
      throw new NotFoundException('Job not found');
    }
    return updatedJob;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.jobModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Job not found');
    }
    return { deleted: true };
  }

  async applyForJob(jobId: string, user: UserDocument): Promise<Job> {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user has already applied
    const hasApplied = job.applicants.some(
      (applicant) => applicant.toString() === user._id.toString(),
    );

    if (hasApplied) {
      throw new BadRequestException('Already applied for this job');
    }

    // Add user to applicants
    const updatedJob = await this.jobModel
      .findByIdAndUpdate(
        jobId,
        { $push: { applicants: user._id } },
        { new: true },
      )
      .populate('applicants', '-password')
      .exec();

    return updatedJob;
  }

  async getJobRecommendations(user: UserDocument): Promise<Job[]> {
    const jobs = await this.jobModel.find().exec();
    const recommendations = jobs.filter((job) => {
      let score = 0;

      // Check industry match
      if (user.profile?.industry === job.industry) {
        score += 2;
      }

      // Check experience level match
      if (user.profile?.experienceLevel === job.experienceLevel) {
        score += 2;
      }

      // Consider a job recommended if it has a score > 0
      return score > 0;
    });

    return recommendations;
  }

  async searchJobs(query: string): Promise<Job[]> {
    return this.jobModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { industry: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }

  async getJobsByIndustry(industry: string): Promise<Job[]> {
    return this.jobModel.find({ industry }).exec();
  }

  async getJobsByExperienceLevel(level: string): Promise<Job[]> {
    return this.jobModel.find({ experienceLevel: level }).exec();
  }

  async getJobsByLocation(location: string): Promise<Job[]> {
    return this.jobModel
      .find({
        location: { $regex: location, $options: 'i' },
      })
      .exec();
  }

  async getApplicants(jobId: string): Promise<User[]> {
    const job = await this.jobModel
      .findById(jobId)
      .populate('applicants', '-password')
      .exec();

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job.applicants;
  }
}
