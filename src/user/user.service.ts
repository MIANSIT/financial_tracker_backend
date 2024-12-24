/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { User } from './user.interface';
// import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  private users: User[] = [];

  // Fetch all users
  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Add a new user
  async create(user: CreateUserDto): Promise<User> {
    const check_email = await this.userModel
      .find({
        email: user.email,
      })
      .exec();
    const check_phone = await this.userModel
      .find({
        phone_number: user.phone_number,
      })
      .exec();
    if (check_email.length > 0 || check_phone.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User already exists',
        },
        HttpStatus.CONFLICT,
        {},
      );
    }
    try {
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem while procerssing the request',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  // // Find user by ID
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // // Remove user by ID
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
    }
  }

  // // Update user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec(); // Fetch the user by ID
      if (!user) {
        throw new Error(`User with ID ${id} not found`); // Handle user not found
      }

      // Check for any fields other than 'name' and 'email' in the update request
      const allowedFields = ['name', 'email'];
      const updateFields = Object.keys(updateUserDto);

      // If any field other than name or email is included, throw an error
      const invalidFields = updateFields.filter(
        (field) => !allowedFields.includes(field),
      );
      if (invalidFields.length > 0) {
        throw new Error(
          `Cannot update these fields: ${invalidFields.join(', ')}`,
        );
      }

      // Update fields if provided
      if (updateUserDto.name) user.name = updateUserDto.name;
      if (updateUserDto.email) user.email = updateUserDto.email;

      return user.save(); // Save the updated user to the database
    } catch (error) {
      throw new Error(`Error updating user with ID ${id}: ${error.message}`);
    }
  }
}
