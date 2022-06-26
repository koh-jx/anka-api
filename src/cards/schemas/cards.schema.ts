import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { CardFace } from '../interfaces/cards.interface';


@Schema()
export class Card {
  @Prop({ required: true, unique: true, index: true })
  id: string;
  @Prop({ required: true})
  front: CardFace;
  @Prop({ required: true})
  back: CardFace;

  @Prop(
    raw([
      {
        frontTitle: { type: String },
        frontDescription: { type: String },
      },
    ]),
  )
  frontCardProps!: Record<string, any>;

  @Prop(
    raw([
      {
        backTitle: { type: String },
        backDescription: { type: String },
      },
    ]),
  )
  backCardProps!: Record<string, any>;

}

export const CardSchema = SchemaFactory.createForClass(Card);
