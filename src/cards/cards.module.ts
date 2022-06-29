import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CardsService } from './cards.service';
import { Card, CardSchema } from './schemas/cards.schema';
import { CardsController } from './cards.controller';

import { DecksModule } from 'src/decks/decks.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    forwardRef(() => DecksModule),
    UsersModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
