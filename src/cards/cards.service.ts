import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Card } from './schemas/cards.schema';
import { CardDocument } from './interfaces/cards.interface';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private readonly cardsModel: Model<CardDocument>
  ) {}

  // CRUD functions
  async getCardById(id: string): Promise<CardDocument> {
    return await this.cardsModel.findById(id).exec();
  }

  async updateCard(id: string, card: CardDocument): Promise<CardDocument> {
    return await this.cardsModel.findByIdAndUpdate(id, card, { new: true }).exec();
  }

  async createCard(card: CardDocument): Promise<CardDocument> {
    return await this.cardsModel.create(card);
  }

  async deleteCard(id: string): Promise<CardDocument> {
    return await this.cardsModel.findByIdAndDelete(id).exec();
  }

}
