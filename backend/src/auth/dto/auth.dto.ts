import { IsNotEmpty, IsEmail, IsString, ValidateIf } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username)
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.email)
  username?: string;
}

export class TwoFaDto {
  @IsNotEmpty()
  verificationCode: string;

  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username)
  email?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.email)
  username?: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}