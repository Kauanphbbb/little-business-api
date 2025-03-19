import { HashService } from 'src/shared/hash/hash.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let sut: UsersService;
  let mockUserRepository: Repository<User>;
  let mockHashService: HashService;

  beforeEach(() => {
    // Mock do UserRepository
    mockUserRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<User>; // Cast para Repository<User>

    // Mock do HashService
    mockHashService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    // Cria uma instância do UsersService com os mocks
    sut = new UsersService(mockUserRepository, mockHashService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
