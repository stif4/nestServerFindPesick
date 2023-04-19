import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColorCat, ColorCatDocument } from './color-cat.model/color-cat.model';

@Injectable()
export class ColorCatService {
  constructor(
    @InjectModel(ColorCat.name)
    private readonly colorCatModel: Model<ColorCatDocument>,
  ) {}

  async getAll() {
    return this.colorCatModel.find().exec();
  }
}
