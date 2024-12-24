/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;
}
