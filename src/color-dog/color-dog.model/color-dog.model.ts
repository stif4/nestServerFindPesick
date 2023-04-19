import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ColorDogDocument = HydratedDocument<ColorDog>;

@Schema()
export class ColorDog {
  @Prop()
  value: string;
  @Prop()
  label: string;
}
export const ColorDogModel = SchemaFactory.createForClass(ColorDog);
