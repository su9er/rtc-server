import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
