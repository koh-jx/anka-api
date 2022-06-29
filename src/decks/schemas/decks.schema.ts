import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Card } from '../../cards/schemas/cards.schema';

@Schema()
export class Deck {
  @Prop({ required: true, unique: true, index: true })
  id: string;
  @Prop({ required: true})
  name: string;
  @Prop({required: true})
  cards: string[]

}

export const DeckSchema = SchemaFactory.createForClass(Deck);
