import { IsEmail, IsString, MinLength } from 'class-validator';

// Inputs to sign in with email and password
export class SignInPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
