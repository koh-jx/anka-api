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

  // Deletes a deck from the database
  // If there are references to any cards, remove the deck from the cards' decks array by calling removeDeckFromCard
  async deleteDeck(id: string): Promise<DeckDocument> {
    const deckDeleted =  await this.decksModel.findOneAndDelete({ id }).exec();
    for (const card of deckDeleted.cards) {
      await this.cardsService.removeDeckFromCard(card.id, deckDeleted.id);
    }
    return deckDeleted;
  }

  // Delete a card from the deck's array
  // Called from card.service deleteCard
  // The deck will NOT be deleted even if there are no cards in it
  async removeCardFromDeck(cardId: string, deckId: string) {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    deck.cards = deck.cards.filter(card => card.id !== cardId);
    await deck.save();
  }

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
