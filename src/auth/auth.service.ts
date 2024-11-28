import {
  Injectable,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Check if the email already exists
      const existingUser = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      // Create the user with plain password
      const user = await this.usersService.create(registerDto);

      this.logger.log(`User registered: ${user.email}`);

      // Ensure user is properly converted to object before destructuring
      const userObject = user.toObject ? user.toObject() : user;
      const { password: _password, ...result } = userObject;

      return result;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);

      if (!user) {
        this.logger.warn(
          `Login attempt for non-existent email: ${loginDto.email}`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = loginDto.password === user.password;

      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for email: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        email: user.email,
        sub: user._id, // Changed from user.id to user._id for MongoDB
        role: user.role,
      };

      // Ensure user is properly converted to object before destructuring
      const userObject = user.toObject ? user.toObject() : user;
      const { password: _password, ...userWithoutPassword } = userObject;

      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && user.password === password) {
        const userObject = user.toObject ? user.toObject() : user;
        const { password: _password, ...result } = userObject;
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error(`User validation error: ${error.message}`);
      return null;
    }
  }
}
