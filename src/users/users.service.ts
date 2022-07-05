import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/users.schema';
import { UserDocument } from './interfaces/users.interface';
import { DeckDocument } from 'src/decks/interfaces/decks.interface';
import { DecksService } from 'src/decks/decks.service';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
    @Inject(forwardRef(() => DecksService)) private readonly decksService: DecksService,
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
    return this.usersModel.findOne({ id }).exec();
  }


  //// CARD ARRAY RELATED FUNCTIONS /////////////////////////////////////////////////////////////////////
  // Add card to the main array
  async addCard(userId : string, cardId: string): Promise<User | undefined> {
    // Filter by user id
    const filter = { id: userId };
    // Push cardId
    const update = {
      $push: { cards: { $each: [cardId] } }
    };

    return this.usersModel.findOneAndUpdate(filter, update, { new: true });
  }

  // Remove card from the main array
  async removeCard(userId : string, cardId: string): Promise<User | undefined> {
    // Filter by user id
    const filter = { id: userId };
    // Pull cardId
    const update = {
      $pull: { cards: cardId }
    };

    return this.usersModel.findOneAndUpdate(filter, update, { new: true });
  }

  //// DECK ARRAY RELATED FUNCTIONS /////////////////////////////////////////////////////////////////////
  // Add deck to the main array
  async addDeck(userId : string, deckId: string): Promise<User | undefined> {
    // Filter by user id
    const filter = { id: userId };
    // Push deckId
    const update = {
      $push: { decks: { $each: [deckId] } }
    };

    return this.usersModel.findOneAndUpdate(filter, update, { new: true });
  }

  // Remove deck from the main array
  async removeDeck(userId : string, deckId: string): Promise<User | undefined> {
    // Filter by user id
    const filter = { id: userId };
    // Pull deckId
    const update = {
      $pull: { decks: deckId }
    };

    return this.usersModel.findOneAndUpdate(filter, update, { new: true });
  }

  async getDecksFromUser(userId: string, page: number) : Promise<DeckDocument[]> {
    const user = await this.usersModel.findOne({ id: userId }).exec();
    // There are maximum 12 decks in a page
    const decks = user.decks.slice((page - 12) * 12, page * 12);
    return Promise.all(decks.map(deckId => this.decksService.getDeckById(deckId)));
  }
}
