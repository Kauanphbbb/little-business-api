import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/shared/hash/hash.service';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { email, password } = authenticateDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await this.hashService.comparePassword(
      password,
      user.password,
    );

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

    return token;
  }
}
