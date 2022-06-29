import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Card } from './schemas/cards.schema';
import { CardDocument, CardFace } from './interfaces/cards.interface';
import { DecksService } from 'src/decks/decks.service';

@Injectable()
export class CardsService {
  constructor(
    @Inject(forwardRef(() => DecksService)) private readonly decksService: DecksService,
    @InjectModel(Card.name) private readonly cardsModel: Model<CardDocument>,
  ) {}

  // CRUD functions
  async getCardById(id: string): Promise<CardDocument> {
    return await this.cardsModel.findOne({ id }).exec();
  }

  // Not sure if this function preserves Decks array? TBC if causes any problems
  async updateCard(
    id: string, 
    frontFace         : string,
    backFace          : string,
    frontTitle        : string,
    frontDescription  : string,
    backTitle         : string,
    backDescription   : string,
  ): Promise<CardDocument> {
    const temp = await this.createCardDocument(
      frontFace,
      backFace,
      frontTitle,
      frontDescription,
      backTitle,
      backDescription
    );
    temp['id'] = id;
    return await this.cardsModel.findOneAndUpdate(
      { id }, 
      temp, 
      { new: true });
  }

  async deleteCard(id: string): Promise<CardDocument> {
    // Remove card from all decks in the decks array
    // const card = await this.getCardById(id);
    // const card.decks.forEach(deckId => {
    //   this.decksService.removeCardFromDeck(deckId, id);
    // }
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
