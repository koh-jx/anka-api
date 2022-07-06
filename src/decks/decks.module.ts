import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DecksService } from './decks.service';
import { Deck, DeckSchema } from './schemas/decks.schema';
import { DecksController } from './decks.controller';

import { CardsModule } from 'src/cards/cards.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    forwardRef(() => CardsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
