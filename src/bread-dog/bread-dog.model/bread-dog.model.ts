import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BreadDogDocument = HydratedDocument<BreadDog>;

@Schema()
export class BreadDog {
  @Prop()
  value: string;
  @Prop()
  label: string;
}
export const BreadDogModel = SchemaFactory.createForClass(BreadDog);
