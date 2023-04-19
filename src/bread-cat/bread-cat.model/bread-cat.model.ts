import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BreadCatDocument = HydratedDocument<BreadCat>;

@Schema()
export class BreadCat {
  @Prop()
  value: string;
  @Prop()
  label: string;
}
export const BreadCatModel = SchemaFactory.createForClass(BreadCat);
