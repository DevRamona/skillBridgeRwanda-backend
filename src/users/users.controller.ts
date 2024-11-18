import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/auth-guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { User } from './schemas/user.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: Partial<User['profile']>,
  ) {
    return this.usersService.updateProfile(id, profileData);
  }

  @Post(':id/skills')
  async addSkill(@Param('id') id: string, @Body('skill') skill: string) {
    return this.usersService.addSkill(id, skill);
  }

  @Delete(':id/skills/:skill')
  async removeSkill(@Param('id') id: string, @Param('skill') skill: string) {
    return this.usersService.removeSkill(id, skill);
  }

  @Post(':id/courses/:courseId/enroll')
  async enrollInCourse(
    @Param('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.usersService.enrollInCourse(userId, courseId);
  }

  @Delete(':id/courses/:courseId/unenroll')
  async unenrollFromCourse(
    @Param('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.usersService.unenrollFromCourse(userId, courseId);
  }
}
