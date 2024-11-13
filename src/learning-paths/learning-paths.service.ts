import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningPath } from './schemas/path.schema';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectRepository(LearningPath)
    private learningPathRepository: Repository<LearningPath>,
  ) {}

  async create(
    createLearningPathDto: CreateLearningPathDto,
  ): Promise<LearningPath> {
    const learningPath = this.learningPathRepository.create(
      createLearningPathDto,
    );
    return await this.learningPathRepository.save(learningPath);
  }

  async findAll(): Promise<LearningPath[]> {
    return await this.learningPathRepository.find({
      relations: ['courses', 'enrolledUsers'],
    });
  }

  async findOne(id: string): Promise<LearningPath> {
    const learningPath = await this.learningPathRepository.findOne({
      where: { id },
      relations: ['courses', 'enrolledUsers'],
    });
    if (!learningPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
    return learningPath;
  }

  async update(
    id: string,
    updateLearningPathDto: UpdateLearningPathDto,
  ): Promise<LearningPath> {
    const learningPath = await this.findOne(id);
    Object.assign(learningPath, updateLearningPathDto);
    return await this.learningPathRepository.save(learningPath);
  }

  async remove(id: string): Promise<void> {
    const result = await this.learningPathRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
  }
}
