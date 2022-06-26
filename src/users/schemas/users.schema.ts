import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true, index: true })
  id: string;
  @Prop({ required: true, unique: true })
  username!: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  cards: string[] = [];   // Array of ids each referencing Cards
}

export const UserSchema = SchemaFactory.createForClass(User);
