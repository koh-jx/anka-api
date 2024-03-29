import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Card } from './schemas/cards.schema';
import { CardDocument, CardFace } from './interfaces/cards.interface';
import { DecksService } from 'src/decks/decks.service';
import { UsersService } from 'src/users/users.service';
import { assert } from 'console';

@Injectable()
export class CardsService {
  constructor(
    @Inject(forwardRef(() => DecksService)) private readonly decksService: DecksService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
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

  async reviewCard(cardId: string, selfEvaluation: number) : Promise<CardDocument> {
    const card = await this.cardsModel.findOne({ id: cardId }).exec();
    const { consecutiveRecallCount, easinessFactor, interval } = card;
    const { newConsecutiveRecallCount, newEasinessFactor, newInterval } = await this.sm2(
      consecutiveRecallCount,
      easinessFactor,
      interval,
      selfEvaluation
    );
    card.consecutiveRecallCount = newConsecutiveRecallCount;
    card.easinessFactor = newEasinessFactor;
    card.interval = newInterval;
    card.lastReviewedDate = new Date();
    await card.save();
    return card;
  }

  // SM2 algorithm
  async sm2(
    consecutiveRecallCount: number,
    easinessFactor: number,
    interval: number,
    selfEvaluation: number,
  ): Promise<{ newConsecutiveRecallCount: number, newEasinessFactor: number, newInterval: number }> {
    let newConsecutiveRecallCount = undefined;
    let newEasinessFactor = undefined;
    let newInterval = undefined;

    if (selfEvaluation >= 3) {  // Correct response
      if (consecutiveRecallCount === 0) {
        newInterval = 1;
      } else if (consecutiveRecallCount === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easinessFactor);
      }
      newConsecutiveRecallCount = consecutiveRecallCount + 1;
    } else {    // Incorrect response
       newConsecutiveRecallCount = 0;
       newInterval = 1;
    }

    newEasinessFactor = easinessFactor + (0.1 - (5 - easinessFactor) * (0.08 * (5 - easinessFactor) + 0.02));
    if (newEasinessFactor < 1.3) {
      newEasinessFactor = 1.3;
    }

    assert(newInterval !== undefined, 'newInterval is undefined');
    assert(newEasinessFactor !== undefined, 'newEasinessFactor is undefined');
    assert(newConsecutiveRecallCount !== undefined, 'newConsecutiveRecallCount is undefined');
    return { newConsecutiveRecallCount, newEasinessFactor, newInterval };
  }

  // Deletes a card from the database
  // If there are references to any decks, remove the card from the deck by calling removeCardFromDeck
  async deleteCard(id: string, userId: string): Promise<CardDocument> {
    // Remove card from all decks in the decks array
    const card = await this.cardsModel.findOneAndDelete({ id }).exec()
    card.decks.forEach(deckId => {
      this.decksService.removeCardFromDeck(id, deckId);
    });
    this.usersService.removeCard(userId, id);
    return card;
  }

  // Delete a deck from the card's array
  // Only called when the card is affected from a deck deletion ( ie deck.service deleteDeck() )
  // or when said card is no longer affliated with the deck (ie deck.service removeCardFromDeckController() )
  // The card will not be deleted even if there are no decks left
  async removeDeckFromCard(cardId: string, deckId: string) {
    const card = await this.cardsModel.findOne({ id: cardId }).exec();
    card.decks = card.decks.filter(deck => deck !== deckId);
    await card.save();  
  }

  // Add deck to card's decks array
  // Only called when the card is being added to a deck (ie deck.service addCardToDeck() )
  async addDeckToCard(cardId: string, deckId: string) {
    const card = await this.cardsModel.findOne({ id: cardId }).exec();
    card.decks.push(deckId);
    await card.save();
  }

  async createCard(
    frontFace         : string,
    backFace          : string,
    frontTitle        : string,
    frontDescription  : string,
    backTitle         : string,
    backDescription   : string,
    userId            : string,
  ): Promise<CardDocument> {
    const result = await this.cardsModel.create(
      await this.createCardDocument(
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription
      )
    );
    this.usersService.addCard(userId, result.id);
    return result;
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
