import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authenticate.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const { email } = authenticateDto;

    const user = this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const passwordMatch = await compare(password, user.password);

    // if (!passwordMatch) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // Generate JWT token

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
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
