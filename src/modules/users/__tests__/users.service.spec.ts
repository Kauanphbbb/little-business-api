import { ConflictException } from '@nestjs/common';
import { HashService } from 'src/shared/hash/hash.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let sut: UsersService;

  const mockUserRepository = {} as Repository<User>;

  const mockHashService = {} as HashService;

  beforeEach(() => {
    mockUserRepository.save = jest.fn();
    mockUserRepository.findOneBy = jest.fn();
    mockUserRepository.create = jest.fn();

    mockHashService.hashPassword = jest.fn();

    sut = new UsersService(mockUserRepository, mockHashService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'q6tE2@example.com',
        password: 'password123',
      };

      mockUserRepository.findOneBy = jest.fn().mockResolvedValue(null);

      mockHashService.hashPassword = jest
        .fn()
        .mockResolvedValue('hashedPassword');

      mockUserRepository.create = jest.fn().mockReturnValue({
        ...createUserDto,
        password: 'hashedPassword',
      });

      mockUserRepository.save = jest.fn().mockResolvedValue({
        ...createUserDto,
        password: 'hashedPassword',
      });

      // Act
      const result = await sut.create(createUserDto);

      // Assert
      expect(result).toEqual({
        ...createUserDto,
        password: 'hashedPassword',
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });

      expect(mockHashService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

      expect(mockHashService.hashPassword).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'q6tE2@example.com',
        password: 'password123',
      };

      mockUserRepository.findOneBy = jest.fn().mockResolvedValue({
        ...createUserDto,
        password: 'hashedPassword',
      });

      // Act & Assert
      await expect(sut.create(createUserDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.create).not.toHaveBeenCalled();

      expect(mockUserRepository.save).not.toHaveBeenCalled();

      expect(mockHashService.hashPassword).not.toHaveBeenCalled();
    });
  });
});
