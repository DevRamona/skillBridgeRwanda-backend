import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathsService } from './learning-paths.service';
import { getModelToken } from '@nestjs/mongoose';
import { LearningPath } from './schemas/path.schema'; // Fixed the import path

describe('LearningPathsService', () => {
  let service: LearningPathsService;

  const mockLearningPathModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningPathsService,
        {
          provide: getModelToken(LearningPath.name),
          useValue: mockLearningPathModel,
        },
      ],
    }).compile();

    service = module.get<LearningPathsService>(LearningPathsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
