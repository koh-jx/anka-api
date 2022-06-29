import { Injectable, Inject, forwardRef} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Deck } from './schemas/decks.schema';
import { DeckDocument } from './interfaces/decks.interface';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class DecksService {
  constructor(
    @Inject(forwardRef(() => CardsService)) private readonly cardsService: CardsService,
    @InjectModel(Deck.name) private readonly decksModel: Model<DeckDocument>
  ) {}

  // CRUD functions
  async getDeckById(id: string): Promise<DeckDocument> {
    return await this.decksModel.findOne({ id }).exec();
  }

  // async updateCard(
  //   id: string, 
  //   frontFace         : string,
  //   backFace          : string,
  //   frontTitle        : string,
  //   frontDescription  : string,
  //   backTitle         : string,
  //   backDescription   : string,
  // ): Promise<CardDocument> {
  //   const temp = await this.createCardDocument(
  //     frontFace,
  //     backFace,
  //     frontTitle,
  //     frontDescription,
  //     backTitle,
  //     backDescription
  //   );
  //   temp['id'] = id;
  //   return await this.cardsModel.findOneAndUpdate(
  //     { id }, 
  //     temp, 
  //     { new: true });
  // }

  // async deleteCard(id: string): Promise<CardDocument> {
  //   return await this.cardsModel.findOneAndDelete({ id }).exec();
  // }

  async createDeck(name: string): Promise<DeckDocument> {
    return await this.decksModel.create(
      await this.createDeckDocument(name)
    );
  }

  // Facilitate Creation and Update of Card for the card model
  async createDeckDocument(name: string) {
    const id = new mongoose.Types.ObjectId().toHexString();
    return {
      id,
      name,
    };
  }

}
