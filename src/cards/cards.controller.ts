import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    Req,
    Query,
    UseGuards,
    Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    // CRUD - Create
    @UseGuards(JwtAuthGuard)
    @Get('/card')
    async getProjects(@Res() res, @Req() req, @Query('id') id: string) {
      try {
        const result = { card: await this.cardsService.getCardById(id) };
        res.status(200).send(result);
      } catch (error: any) {
        res.status(400).send({ error: "Bad request", error_description: error.message });
      }
    }
}
  