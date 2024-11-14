import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';

describe('CoursesService', () => {
  let service: CoursesService;

  const mockCourse = {
    title: 'Test Course',
    description: 'Test Description',
    duration: '2 weeks',
    level: 'Beginner',
    topics: ['JavaScript'],
    instructor: 'John Doe',
  };

  const mockCourseModel = {
    create: jest.fn().mockResolvedValue(mockCourse),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockCourse]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getModelToken(Course.name),
          useValue: mockCourseModel,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCourse]);
    });
  });
});
