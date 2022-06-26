import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { User } from './schemas/users.schema';
import { UserDocument } from './interfaces/users.interface';

import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>
  ) {}

  async register(username: string, password: string): Promise<User> {
    const id = new mongoose.Types.ObjectId().toHexString();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new this.usersModel({
      id,
      username,
      password: hash,
    });
    return await newUser.save();
  }

  // Find a user with the username
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersModel.findOne({ username }).exec();
  }

  // Find a user with the username
  async findOneById(id : string): Promise<User | undefined> {
    return this.usersModel.findById({ id }).exec();
  }
}
