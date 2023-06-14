import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelegramDocument = HydratedDocument<Telegram>;

@Schema()
export class Telegram {
  @Prop()
  chatId: string;
  @Prop()
  username: string;
}
export const TelegramModel = SchemaFactory.createForClass(Telegram);
