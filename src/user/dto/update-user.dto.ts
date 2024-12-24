/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional() 
  name?: string;

  @IsString()
  @IsOptional()
  @IsEmail() 
  email?: string;
}
