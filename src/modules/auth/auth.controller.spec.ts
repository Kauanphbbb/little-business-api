import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(), // Mock do método authenticate
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService); // Obtém a instância do AuthService mockado
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authenticate', () => {
    it('should call authService.authenticate with the correct parameters', async () => {
      const authenticateDto: AuthenticateDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      // Configura o mock para retornar um valor simulado
      (authService.authenticate as jest.Mock).mockResolvedValue({
        token: 'fake-token',
      });

      // Chama o método do controller
      const result = await controller.authenticate(authenticateDto);

      // Verifica se o método do service foi chamado com os parâmetros corretos
      expect(authService.authenticate).toHaveBeenCalledWith(authenticateDto);

      // Verifica o resultado retornado pelo controller
      expect(result).toEqual({ token: 'fake-token' });
    });
  });
});
