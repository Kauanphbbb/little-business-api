import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }
}
