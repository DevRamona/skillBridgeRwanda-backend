import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPath, LearningPathDocument } from './schemas/path.schema';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectModel(LearningPath.name)
    private learningPathModel: Model<LearningPathDocument>,
  ) {}

  async create(
    createLearningPathDto: CreateLearningPathDto,
  ): Promise<LearningPath> {
    const createdPath = new this.learningPathModel(createLearningPathDto);
    return createdPath.save();
  }

  async findAll(): Promise<LearningPath[]> {
    return this.learningPathModel
      .find()
      .populate('courses')
      .populate('enrolledUsers', '-password')
      .exec();
  }

  async findOne(id: string): Promise<LearningPath> {
    const path = await this.learningPathModel
      .findById(id)
      .populate('courses')
      .populate('enrolledUsers', '-password')
      .exec();

    if (!path) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
    return path;
  }

  async update(
    id: string,
    updateLearningPathDto: UpdateLearningPathDto,
  ): Promise<LearningPath> {
    const updatedPath = await this.learningPathModel
      .findByIdAndUpdate(id, updateLearningPathDto, { new: true })
      .populate('courses')
      .populate('enrolledUsers', '-password')
      .exec();

    if (!updatedPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
    return updatedPath;
  }

  async remove(id: string): Promise<void> {
    const result = await this.learningPathModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
  }

  async enrollUser(pathId: string, userId: string): Promise<LearningPath> {
    const path = await this.learningPathModel
      .findByIdAndUpdate(
        pathId,
        { $addToSet: { enrolledUsers: userId } },
        { new: true },
      )
      .populate('courses')
      .populate('enrolledUsers', '-password')
      .exec();

    if (!path) {
      throw new NotFoundException(`Learning path with ID ${pathId} not found`);
    }
    return path;
  }

  async unenrollUser(pathId: string, userId: string): Promise<LearningPath> {
    const path = await this.learningPathModel
      .findByIdAndUpdate(
        pathId,
        { $pull: { enrolledUsers: userId } },
        { new: true },
      )
      .populate('courses')
      .populate('enrolledUsers', '-password')
      .exec();

    if (!path) {
      throw new NotFoundException(`Learning path with ID ${pathId} not found`);
    }
    return path;
  }

  async updateRating(pathId: string, rating: number): Promise<LearningPath> {
    const path = await this.findOne(pathId);
    path.rating = (path.rating + rating) / 2;
    return path.save();
  }
}
