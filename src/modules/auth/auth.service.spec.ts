import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let sut: AuthService;
  let mockUsersService: UsersService;
  let mockJwtService: JwtService;

  beforeEach(() => {
    mockUsersService = {
      findOneByEmail: jest.fn(),
    } as unknown as UsersService;

    mockJwtService = {
      signAsync: jest.fn(),
    } as unknown as JwtService;

    sut = new AuthService(mockUsersService, mockJwtService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
