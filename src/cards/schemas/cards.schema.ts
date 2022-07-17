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
  @Prop()
  decks: string[] = [];   // Array of ids each referencing Decks

  // SM2-algorithm
  @Prop({type: Number, default: 0})
  consecutiveRecallCount: number;
  @Prop({type: Number, default: 2.5})
  easinessFactor: number;
  @Prop({type: Number, default: 0})
  interval: number;
  
  // Date variables
  @Prop({type: Date, default: null})
  lastReviewedDate : Date;
  @Prop({type: Date, default: Date.now})
  dateCreated : Date;

  @Prop(
    raw(
      {
        frontTitle: { type: String },
        frontDescription: { type: String },
      },
    ),
  )
  frontCardFaceProps!: Record<string, any>;

  @Prop(
    raw(
      {
        backTitle: { type: String },
        backDescription: { type: String },
      },
    ),
  )
  backCardFaceProps!: Record<string, any>;

}

export const CardSchema = SchemaFactory.createForClass(Card);
