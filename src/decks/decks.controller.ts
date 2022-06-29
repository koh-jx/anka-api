import {
    Controller,
    Delete,
    Get,
    Post,
    Res,
    Patch,
    Query,
    UseGuards,
    Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { DecksService } from './decks.service';

@Controller('deck')
export class DecksController {
  constructor(private readonly cardsService: DecksService) {}

  // // Get a single card by its id
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getCard(@Res() res, @Query('id') id: string) {
  //   try {
  //     const result = await this.cardsService.getCardById(id);
  //     res.status(200).send(result);
  //   } catch (error: any) {
  //     res.status(400).send({ error: "Bad request", error_description: error.message });
  //   }
  // }
  
  // // Create a single card
  // // To add to a user deck, will still have to call the PATCH 'users/deck' endpoint
  // // will be updated to 'decks/id' in the future
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async createCard(
  //   @Res() res,
  //   @Body('front') frontFace: string,
  //   @Body('back') backFace: string,
  //   @Body('frontTitle') frontTitle: string,
  //   @Body('frontDescription') frontDescription: string,
  //   @Body('backTitle') backTitle: string,
  //   @Body('backDescription') backDescription: string,
  // ) {
  //   try {
  //     // Check is faces are valid
  //     if (!frontFace || !backFace) {
  //       res.status(400).send({ error: "Bad request", error_description: "Missing front or back face" });
  //     }

  //     // Create template cardDocument
  //     const card = await this.cardsService.createCard(
  //       frontFace,
  //       backFace,
  //       frontTitle,
  //       frontDescription,
  //       backTitle,
  //       backDescription,
  //     )

  //     res.status(201).send(card);
  //   } catch (error : any) {
  //     res.status(400).send({ error: "Bad request", error_description: error.message });
  //   }
  // }

  // // Edit a single card, finds the card via its id, then updates it
  // // Don't need to edit anywhere else, since card details are only stored in this collection
  // @UseGuards(JwtAuthGuard)
  // @Patch()
  // async updateCard(
  //   @Res() res,
  //   @Body('id') id: string,
  //   @Body('front') frontFace: string,
  //   @Body('back') backFace: string,
  //   @Body('frontTitle') frontTitle: string,
  //   @Body('frontDescription') frontDescription: string,
  //   @Body('backTitle') backTitle: string,
  //   @Body('backDescription') backDescription: string,
  // ) {
  //   try {
  //     // Check is faces are valid
  //     if (!frontFace || !backFace) {
  //       res.status(400).send({ error: "Bad request", error_description: "Missing front or back face" });
  //     }

  //     // Create template cardDocument
  //     const card = await this.cardsService.updateCard(
  //       id,
  //       frontFace,
  //       backFace,
  //       frontTitle,
  //       frontDescription,
  //       backTitle,
  //       backDescription,
  //     )
  //     res.status(200).send(card);
  //   } catch (error : any) {
  //     res.status(400).send({ error: "Bad request", error_description: error.message });
  //   }
  // }

  // // Delete a single card, finds it via its id
  // // To delete from a user deck, will still have to call the DELETE 'users/deck' endpoint
  // // will be updated to 'decks/id' in the future
  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async deleteCard(
  //   @Res() res,
  //   @Query('id') id: string,
  // ) {
  //   try {
  //     // Create template cardDocument
  //     const card = await this.cardsService.deleteCard(id)
  //     res.status(200).send(card);
  //   } catch (error : any) {
  //     res.status(400).send({ error: "Bad request", error_description: error.message });
  //   }
  // }  
}

  