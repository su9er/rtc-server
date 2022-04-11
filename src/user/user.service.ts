import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: string) {
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

  async getUserByUsername(username: string) {
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
    const user = await this.getUserById(id);
    await this.userRepository.update(id, createUserDto);
    return user;
  }

  async setUserRefreshToken(refreshToken: string, userId: string) {
    const currenthashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currenthashedRefreshToken,
    });
  }

  async removeUserRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currenthashedRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currenthashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new HttpException(
        `Refresh token is not matching`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
