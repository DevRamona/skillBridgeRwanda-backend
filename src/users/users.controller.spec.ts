import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { mockUser, mockUserModel } from '../mocks/user.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
    getUserSkills: jest.fn().mockResolvedValue(mockUser.skills),
    getUserProfile: jest.fn().mockResolvedValue(mockUser.profile),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
    });
  });

  describe('getUserSkills', () => {
    it('should return user skills', async () => {
      const userId = 'testId';
      expect(await controller.getUserSkills(userId)).toEqual(mockUser.skills);
      expect(service.getUserSkills).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const userId = 'testId';
      expect(await controller.getProfile(userId)).toEqual(mockUser.profile);
      expect(service.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });
});
