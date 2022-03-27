import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `There is no user under id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      return user;
    }

    throw new HttpException(
      `There is no user under username ${username}`,
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async update(id: string, createUserDto: CreateUserDto) {
    const user = await this.findOne(id);
    await this.userRepository.update(id, createUserDto);
    return user;
  }
}
