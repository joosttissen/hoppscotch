import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

// Inputs to sign up with email and password
export class SignUpPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}
