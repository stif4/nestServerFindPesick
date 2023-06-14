import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ColorDog } from './../../color-dog/color-dog.model/color-dog.model';
import { BreadDog } from './../../bread-dog/bread-dog.model/bread-dog.model';
import { Type } from 'class-transformer';

export type PostsDogDocument = HydratedDocument<PostsDog>;

@Schema()
export class PostsDog {
  @Prop()
  userId: string;
  @Prop()
  coords: number[];
  @Prop()
  streetName: string;
  @Prop()
  dogOrCat: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BreadDog.name })
  @Type(() => BreadDog)
  breed: BreadDog;
  @Prop()
  type: number;
  @Prop()
  sex: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ColorDog.name })
  @Type(() => ColorDog)
  color: ColorDog;
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
const PostsDogModel = SchemaFactory.createForClass(PostsDog);
PostsDogModel.index({ coords: '2dsphere' });
export { PostsDogModel };
