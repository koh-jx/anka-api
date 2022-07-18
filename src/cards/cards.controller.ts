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

import { CardsService } from './cards.service';

@Controller('card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // Get a single card by its id
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCard(@Res() res, @Query('id') id: string) {
    try {
      const result = await this.cardsService.getCardById(id);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }
  
  // Create a single card
  // To add to a user deck, will still have to call the PATCH 'users/deck' endpoint
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(
    @Req() req,
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

      // Create template cardDocument
      const card = await this.cardsService.createCard(
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription,
        req.user.id
      )

      res.status(201).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Edit a single card, finds the card via its id, then updates it
  // Don't need to edit anywhere else, since card details are only stored in this collection
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCard(
    @Res() res,
    @Body('id') id: string,
    @Body('front') frontFace: string,
    @Body('back') backFace: string,
    @Body('frontTitle') frontTitle: string,
    @Body('frontDescription') frontDescription: string,
    @Body('backTitle') backTitle: string,
    @Body('backDescription') backDescription: string,
  ) {
    try {
      // Check if faces are valid
      if (!frontFace || !backFace) {
        res.status(400).send({ error: "Bad request", error_description: "Missing front or back face" });
      }

      // Create template cardDocument
      const card = await this.cardsService.updateCard(
        id,
        frontFace,
        backFace,
        frontTitle,
        frontDescription,
        backTitle,
        backDescription,
      )
      res.status(200).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Edit a single card, finds the card via its id, then updates it
  // Don't need to edit anywhere else, since card details are only stored in this collection
  @UseGuards(JwtAuthGuard)
  @Patch('/review')
  async reviewCard(
    @Res() res,
    @Body('id') id: string,
    @Body('selfEvaluation') selfEvaluation: number,
  ) {
    try {
      // Check if score is valid
      if (selfEvaluation < 0 || selfEvaluation > 5) {
        res.status(400).send({ error: "Bad request", error_description: "Invalid Self-Evaluation score" });
      }

      const card = await this.cardsService.reviewCard(id, selfEvaluation)
      res.status(200).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }

  // Delete a single card, finds it via its id
  // To delete from a user deck, will still have to call the DELETE 'users/deck' endpoint
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCard(
    @Req() req,
    @Res() res,
    @Query('id') id: string,
  ) {
    try {
      // Create template cardDocument
      const card = await this.cardsService.deleteCard(id, req.user.id)
      res.status(200).send(card);
    } catch (error : any) {
      res.status(400).send({ error: "Bad request", error_description: error.message });
    }
  }  
}

  