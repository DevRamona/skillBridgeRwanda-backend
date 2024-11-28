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
import { UserDocument } from '../users/schemas/user.schema';

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

      // Create the user without hashing the password
      const user = (await this.usersService.create({
        ...registerDto,
        // Store password as plain text
      })) as UserDocument;

      this.logger.log(`User registered: ${user.email}`);

      const { password: _password, ...result } = user.toObject();
      return result;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
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

      // Directly compare the provided password with the stored password
      const isPasswordValid = loginDto.password === user.password; // Compare plain text passwords
      this.logger.debug(`Password Comparison Result: ${isPasswordValid}`);

      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for email: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const { ...userWithoutPassword } = user.toObject();

      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && password === user.password) {
        // Directly compare plain text passwords
        const { password: _password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error(`User validation error: ${error.message}`);
      return null;
    }
  }
}
