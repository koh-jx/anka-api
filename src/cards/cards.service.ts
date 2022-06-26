import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, AnyKeys } from 'mongoose';

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

  async updateCard(
    id: string, 
    frontFace         : string,
    backFace          : string,
    frontTitle        : string,
    frontDescription  : string,
    backTitle         : string,
    backDescription   : string,
  ): Promise<CardDocument> {
    return await this.cardsModel.findOneAndUpdate(
      { id }, 
      this.createCardDocument(
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription
      ), 
      { new: true });
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
    return await this.cardsModel.create(
      await this.createCardDocument(
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription
      )
    );
  }

  // Facilitate Creation and Update of Card for the card model
  async createCardDocument(
    frontFace         : string,
    backFace          : string,
    frontTitle        : string,
    frontDescription  : string,
    backTitle         : string,
    backDescription   : string,
  ) {
    const id = new mongoose.Types.ObjectId().toHexString();
    // Convert strings to CardFace enum types
    const front = frontFace as CardFace;
    const back = backFace as CardFace;
    return {
      id,
      front,
      back,
      frontCardFaceProps: {
        frontTitle,
        frontDescription,
      },
      backCardFaceProps: {
        backTitle,
        backDescription,
      },
    };
  }

}
