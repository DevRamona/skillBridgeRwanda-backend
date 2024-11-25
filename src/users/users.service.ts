import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Store password as plain text without hashing
    const createdUser = new this.userModel({
      ...createUserDto,
      // No password hashing
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password') // Exclude password from results
      .populate('enrolledCourses')
      .exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-password') // Exclude password from results
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // No password hashing
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password') // Exclude password from results
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async updateProfile(
    id: string,
    profileData: Partial<User['profile']>,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: { profile: profileData } }, { new: true })
      .select('-password') // Exclude password from results
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async addSkill(id: string, skill: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $addToSet: { skills: skill } }, { new: true })
      .select('-password') // Exclude password from results
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async removeSkill(id: string, skill: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $pull: { skills: skill } }, { new: true })
      .select('-password') // Exclude password from results
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async enrollInCourse(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { new: true },
      )
      .select('-password') // Exclude password from results
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
        { new: true },
      )
      .select('-password') // Exclude password from results
      .populate('enrolledCourses')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
