import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/shared/hash/hash.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';

describe('AuthService', () => {
  let sut: AuthService;
  const mockUsersService = {} as UsersService;
  const mockJwtService = {} as JwtService;
  const hashService = {} as HashService;

  beforeEach(() => {
    // Mock do UsersService
    mockUsersService.findOneByEmail = jest.fn().mockClear();

    // Mock do JwtService
    mockJwtService.signAsync = jest.fn().mockClear();

    // Mock do HashService
    hashService.comparePassword = jest.fn().mockClear();

    // Cria uma instância do AuthService com os mocks
    sut = new AuthService(mockUsersService, mockJwtService, hashService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('authenticate', () => {
    it('should return an access token when authentication is successful', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: 'user@example.com',
        password: 'hashedpassword',
      };

      const mockToken = 'fake-token';

      // Configura o mock do findOneByEmail para retornar o usuário mockado
      mockUsersService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);

      // Configura o mock do signAsync para retornar o token mockado
      mockJwtService.signAsync = jest.fn().mockResolvedValue(mockToken);

      // Configura o mock do comparePassword para retornar true
      hashService.comparePassword = jest.fn().mockResolvedValue(true);

      // Chama o método authenticate do service
      const result = await sut.authenticate(authenticateDto);

      // Verifica se o método findOneByEmail foi chamado com o email correto
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        authenticateDto.email,
      );

      // Verifica se o método signAsync foi chamado com o payload correto
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
      });

      // Verifica se o token foi retornado corretamente
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      // Configura o mock do findOneByEmail para retornar null (usuário não encontrado)
      mockUsersService.findOneByEmail = jest.fn().mockResolvedValue(null);

      // Verifica se o método authenticate lança a exceção esperada
      await expect(sut.authenticate(authenticateDto)).rejects.toThrow(
        UnauthorizedException,
      );

      // Verifica se o método findOneByEmail foi chamado com o email correto
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        authenticateDto.email,
      );

      // Verifica se o método signAsync NÃO foi chamado
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
