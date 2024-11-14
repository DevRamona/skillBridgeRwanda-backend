import { Role } from 'src/roles/role.enum';

export const mockUser = {
  email: 'test@example.com',
  password: 'hashedPassword',
  firstName: 'Test',
  lastName: 'User',
  role: Role.USER,
  skills: ['JavaScript', 'Node.js'],
  profile: {
    bio: 'Test bio',
    location: 'Test location',
    position: 'Developer',
  },
  enrolledCourses: [],
};

export const mockUserModel = {
  create: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([mockUser]),
  populate: jest.fn().mockReturnThis(),
};
