import { RegisterDto } from './dto/register.dto';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/database/postgresErrorCode';

@Injectable()
export class AuthenticationService {
  constructor(private readonly UserService: UserService) {}

  async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.UserService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw new HttpException(
          'User with that username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(username: string, password: string) {
    try {
      const user = await this.UserService.findOneByUsername(username);
      if (!user) {
        // An important thing above is that we return the same error, whether the username or password is wrong. Doing so prevents some attacks that would aim to get a list of emails registered in our database.
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.UNAUTHORIZED,
        );
        // throw
        
        
      }
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
