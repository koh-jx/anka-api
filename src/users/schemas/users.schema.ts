import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  // Prop for the user's id
  @Prop({ required: true, unique: true, index: true })
  id: string;
  @Prop({ required: true, unique: true})
  username!: string;
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
