import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(), // Mock do método findOneByEmail
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(), // Mock do método signAsync
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticate', () => {
    it('should return an access token when authentication is successful', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1234',
        email: 'user@example.com',
        password: 'hashedpassword',
      };

      const mockToken = 'fake-token';

      // Configura o mock do UsersService para retornar um usuário simulado
      (usersService.findOneByEmail as jest.Mock).mockReturnValue(mockUser);

      // Configura o mock do JwtService para retornar um token simulado
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

      // Chama o método authenticate do AuthService
      const result = await authService.authenticate(authenticateDto);

      // Verifica se o método findOneByEmail foi chamado com o email correto
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        authenticateDto.email,
      );

      // Verifica se o método signAsync foi chamado com o payload correto
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id });

      // Verifica se o token foi retornado corretamente
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      // Configura o mock do UsersService para retornar null (usuário não encontrado)
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      // Verifica se o método authenticate lança a exceção esperada
      await expect(authService.authenticate(authenticateDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token generation fails', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: 'user@example.com',
        password: 'hashedpassword',
      };

      // Configura o mock do UsersService para retornar um usuário simulado
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);

      // Configura o mock do JwtService para retornar null (falha na geração do token)
      (jwtService.signAsync as jest.Mock).mockResolvedValue(null);

      // Verifica se o método authenticate lança a exceção esperada
      await expect(authService.authenticate(authenticateDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
