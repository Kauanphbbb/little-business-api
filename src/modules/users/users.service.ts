import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/shared/hash/hash.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService, // Injete o HashService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailAlreadyExists = await this.findOneByEmail(createUserDto.email);

    if (emailAlreadyExists) {
      throw new ConflictException('Email already exists');
    }

    // Use o HashService para hashear a senha
    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
