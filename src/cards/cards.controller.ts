import {
    Controller,
    Get,
    Post,
    Res,
    Req,
    Query,
    UseGuards,
    Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CardsService } from './cards.service';

@Controller('card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // Get 1 card
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCard(@Res() res, @Query('id') id: string) {
    try {
      const result = await this.cardsService.getCardById(id);
      console.log(id, result);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }
  
  // Create a single card
  // To add to a user deck, will still have to call the POST 'users/deck/add' endpoint
  // will be updated to 'decks/cards/add' in the future
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(
    @Res() res,
    @Body('front') frontFace: string,
    @Body('back') backFace: string,
    @Body('frontTitle') frontTitle: string,
    @Body('frontDescription') frontDescription: string,
    @Body('backTitle') backTitle: string,
    @Body('backDescription') backDescription: string,
  ) {
    try {
      // Check is faces are valid
      if (!frontFace || !backFace) {
        res.status(400).send({ error: "Bad request", error_description: "Missing front or back face" });
      }

      // Create cardDocument in the CardModel
      const card = await this.cardsService.createCard(
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription,
      )

      res.status(201).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Parse array of card ids into an array of card objects and returns it
  @Get('/cards')
  @UseGuards(JwtAuthGuard)
  async getCardsFromArray(@Body() cards: string[], @Res() res) {
    try {
      const result = [];
      for (const card of cards) {
        const cardObj = await this.cardsService.getCardById(card);
        if (cardObj) {
          result.push(cardObj);
        }
      }
      res.status(200).send(result);
    } catch (e : any) {
      res.status(400).send({ error: "Bad request", error_description: e.message });
    }
  }
}

  