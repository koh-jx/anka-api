import {
    Controller,
    Delete,
    Get,
    Post,
    Res,
    Req,
    Patch,
    Query,
    UseGuards,
    Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { DecksService } from './decks.service';

@Controller('deck')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  // Get a deck by its id
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDeck(@Res() res, @Query('id') id: string) {
    try {
      const result = await this.decksService.getDeckById(id);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }
  
  // Create a singale deck
  // To add to a user deck, will still have to call the PATCH 'users/deck' endpoint
  @UseGuards(JwtAuthGuard)
  @Post()
  async createDeck(
    @Req() req,
    @Res() res,
    @Body('name') name: string,
  ) {
    try {
      // Frontend already confirms that name is valid
      // Create template cardDocument
      const deck = await this.decksService.createDeck(name, req.user.id);
      res.status(201).send(deck);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Edit a deck name, finds the card via its id, then updates it
  // Don't need to edit anywhere else, since card details are only stored in this collection
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateDeck(
    @Res() res,
    @Body('id') id: string,
    @Body('name') name: string,
  ) {
    try {
      const deck = await this.decksService.updateDeck(id, name);
      res.status(200).send(deck);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Add a card to a deck
  @UseGuards(JwtAuthGuard)
  @Patch('/add-card')
  async addCardToDeck(
    @Res() res,
    @Body('id') id: string,
    @Body('cardId') cardId: string,
  ) {
    try {
      const card = await this.decksService.addCardToDeck(cardId, id)
      res.status(200).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Remove a card from the deck
  @UseGuards(JwtAuthGuard)
  @Patch('/remove-card')
  async removeCardFromDeck(
    @Res() res,
    @Body('id') id: string,
    @Body('cardId') cardId: string,
  ) {
    try {
      const deck = await this.decksService.removeCardFromDeckController(cardId, id)
      res.status(200).send(deck);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Delete a deck card, finds it via its id
  // Will still have to call the DELETE 'users/deck' endpoint to remove from the user's deck array
  // Deletes cards within the deck if there is no other reference to them
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteDeck(
    @Req() req,
    @Res() res,
    @Query('id') id: string,
  ) {
    try {
      const deck = await this.decksService.deleteDeck(id, req.user.id)
      res.status(200).send(deck);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }  

  // Get the cards in a deck as CardDocument[] (in a page)
  @UseGuards(JwtAuthGuard)
  @Get('/cards')
  async getCardsFromDeck(@Res() res, @Query('id') id: string, @Query('page') page: string) {
    try {
      const pageNum = parseInt(page);
      const result = await this.decksService.getCardsFromDeck(id, pageNum);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  
  // Get the cards in a deck as CardDocument[] (all to be reviewed)
  @UseGuards(JwtAuthGuard)
  @Get('/review-cards')
  async getCardsToReviewFromDeck(@Res() res, @Query('id') id: string) {
    try {
      const result = await this.decksService.getCardsToReviewFromDeck(id);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }
}

  