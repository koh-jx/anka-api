import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { User } from './schemas/users.schema';
import { UserDocument } from './interfaces/users.interface';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>
  ) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'password',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'password',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.username === username);
    return this.usersModel.findOne({ username }).exec();
  }
}
