import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import RequestWithUser from './interface/request-with-user.interface';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @HttpCode(200)
  @ApiBody({ type: SignupDto })
  async signup(@Body() signupData: SignupDto) {
    const user = await this.authService.signup(signupData);
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
  }
}
