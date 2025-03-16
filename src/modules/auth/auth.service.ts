import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { email, password } = authenticateDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    return this.generateAccessToken(user.id);
  }

  private async generateAccessToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync({
      sub: userId,
    });

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Error generating access token');
    }

    return token;
  }
}
