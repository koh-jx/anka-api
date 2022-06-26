import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Card } from './schemas/cards.schema';
import { CardDocument, CardFace } from './interfaces/cards.interface';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private readonly cardsModel: Model<CardDocument>
  ) {}

  // CRUD functions
  async getCardById(id: string): Promise<CardDocument> {
    return await this.cardsModel.findOne({ id }).exec();
  }

  async updateCard(id: string, card: CardDocument): Promise<CardDocument> {
    return await this.cardsModel.findOneAndUpdate({ id }, card, { new: true });
  }

  async deleteCard(id: string): Promise<CardDocument> {
    return await this.cardsModel.findOneAndDelete({ id }).exec();
  }

  async createCard(
    frontFace         : string,
    backFace          : string,
    frontTitle        : string,
    frontDescription  : string,
    backTitle         : string,
    backDescription   : string,
  ): Promise<CardDocument> {
    const id = new mongoose.Types.ObjectId().toHexString();
    // Convert strings to CardFace enum types
    const front = frontFace as CardFace;
    const back = backFace as CardFace;
    return await this.cardsModel.create({
      id,
      front,
      back,
      frontCardProps: {
        frontTitle,
        frontDescription,
      },
      backCardProps: {
        backTitle,
        backDescription,
      },
    });
  }

}
