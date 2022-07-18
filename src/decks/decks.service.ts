import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Deck } from './schemas/decks.schema';
import { DeckDocument } from './interfaces/decks.interface';
import { CardsService } from 'src/cards/cards.service';
import { CardDocument } from 'src/cards/interfaces/cards.interface';
import { UsersService } from 'src/users/users.service';
import { NUM_CARDS_PER_PAGE } from 'src/constants';

@Injectable()
export class DecksService {
  constructor(
    @Inject(forwardRef(() => CardsService)) private readonly cardsService: CardsService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    @InjectModel(Deck.name) private readonly decksModel: Model<DeckDocument>,
  ) {}

  // CRUD functions
  async getDeckById(id: string): Promise<DeckDocument> {
    return await this.decksModel.findOne({ id }).exec();
  }

  async updateDeck(id : string, name : string): Promise<DeckDocument> {
    // TODO TBC if this preserves the cards array or not
    const temp = await this.createDeckDocument(name);
    temp['id'] = id;
    return await this.decksModel.findOneAndUpdate(
      { id }, 
      temp, 
      { new: true });
  }

  // Deletes a deck from the database
  // If there are references to any cards, remove the deck from the cards' decks array by calling removeDeckFromCard
  async deleteDeck(id: string, userId: string): Promise<DeckDocument> {
    const deckDeleted =  await this.decksModel.findOneAndDelete({ id }).exec();
    for (const card of deckDeleted.cards) {
      await this.cardsService.removeDeckFromCard(card, id);
    }
    this.usersService.removeDeck(userId, id);
    return deckDeleted;
  }

  // Delete a card from the deck's array
  // Called from card.service deleteCard
  // The deck will NOT be deleted even if there are no cards in it
  async removeCardFromDeck(cardId: string, deckId: string) {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    deck.cards = deck.cards.filter(id => id !== cardId);
    await deck.save();
  }

  // The same as the above functiono, but returns a promise of an array of card documents
  // Comes from controller rather than service
  // Also removes the deck from the card's decks array
  async removeCardFromDeckController(cardId: string, deckId: string) {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    deck.cards = deck.cards.filter(id => id !== cardId);
    await deck.save();
    this.cardsService.removeDeckFromCard(cardId, deckId);
    return deck;
  }

  // Add a card to the deck's array
  async addCardToDeck(cardId: string, deckId: string) {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    deck.cards.push(cardId);
    this.cardsService.addDeckToCard(cardId, deckId);
    await deck.save();
    return deck;
  }

  async createDeck(name: string, userId: string): Promise<DeckDocument> {
    const result = await this.decksModel.create(
      await this.createDeckDocument(name)
    );
    this.usersService.addDeck(userId, result.id);
    return result;
  }

  // Facilitate Creation and Update of Card for the card model
  async createDeckDocument(name: string) {
    const id = new mongoose.Types.ObjectId().toHexString();
    return {
      id,
      name,
    };
  }

  // Get all the card documents of the deck from the card db
  async getCardsFromDeck(deckId: string, page: number): Promise<CardDocument[]> {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    const cards = deck.cards.slice((page - 1) * NUM_CARDS_PER_PAGE, page * NUM_CARDS_PER_PAGE);
    return Promise.all(cards.map(id => this.cardsService.getCardById(id)));
  }

  async getCardsToReviewFromDeck(deckId: string): Promise<CardDocument[]> {
    const deck = await this.decksModel.findOne({ id: deckId }).exec();
    const cards = Promise.all(deck.cards.map(id => this.cardsService.getCardById(id)))
    const filteredCards = (await cards).filter(card => this.isDueForReview(card));
    return filteredCards;
  }

  isDueForReview = (card: CardDocument) => {
    if (!card.lastReviewedDate) {
        return true;
    } else if (card.interval) {
        const daysSinceLastReview = (new Date().getTime() - card.lastReviewedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastReview >= card.interval;
    } else {
        return false;
    }
  }

}
