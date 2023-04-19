import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: true })
  login: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isAdmin?: boolean;
}
export const UserModel = SchemaFactory.createForClass(User);
