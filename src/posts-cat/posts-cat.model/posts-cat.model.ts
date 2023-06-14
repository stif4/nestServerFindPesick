import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ColorCat } from 'src/color-cat/color-cat.model/color-cat.model';
import { BreadCat } from 'src/bread-cat/bread-cat.model/bread-cat.model';
import { Type } from 'class-transformer';

export type PostsCatDocument = HydratedDocument<PostsCat>;

@Schema()
export class PostsCat {
  @Prop()
  userId: string;
  @Prop()
  streetName: string;
  @Prop()
  coords: number[];
  @Prop()
  dogOrCat: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BreadCat.name })
  @Type(() => BreadCat)
  breed: BreadCat;
  @Prop()
  type: number;
  @Prop()
  sex: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ColorCat.name })
  @Type(() => ColorCat)
  color: ColorCat;
  @Prop()
  date: Date;
  @Prop()
  phone: string;
  @Prop()
  usernameTg: string;
  @Prop()
  comment: string;
  @Prop()
  photo: string;
}
const PostsCatModel = SchemaFactory.createForClass(PostsCat);
PostsCatModel.index({ coords: '2dsphere' });
export { PostsCatModel };

// export const PostsCatModel = SchemaFactory.createForClass(PostsCat);
