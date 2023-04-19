import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ColorCatDocument = HydratedDocument<ColorCat>;

@Schema()
export class ColorCat {
  @Prop()
  value: string;
  @Prop()
  label: string;
}
export const ColorCatModel = SchemaFactory.createForClass(ColorCat);
