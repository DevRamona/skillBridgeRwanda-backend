import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserProfile } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.enum';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || Role.USER,
      skills: [],
      profile: {},
      enrolledCourses: []
    });

    return createdUser;
  }

  async findAll(role: Role): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .populate('enrolledCourses')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .populate('enrolledCourses')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { deleted: true };
  }

  async getUserSkills(id: string): Promise<string[]> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.skills || [];
  }

  async updateUserSkills(id: string, skills: string[]): Promise<string[]> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { skills } },
        { new: true }
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.skills;
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.profile || {};
  }

  async updateUserProfile(id: string, profile: UserProfile): Promise<UserProfile> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { profile } },
        { new: true }
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.profile;
  }

  async enrollInCourse(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { new: true }
      )
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async unenrollFromCourse(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { enrolledCourses: courseId } },
        { new: true }
      )
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getEnrolledCourses(userId: string): Promise<any[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.enrolledCourses || [];
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid old password');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword })
      .exec();

    return true;
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { role },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}