import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColorDog, ColorDogDocument } from './color-dog.model/color-dog.model';

@Injectable()
export class ColorDogService {
  constructor(
    @InjectModel(ColorDog.name)
    private readonly colorDogModel: Model<ColorDogDocument>,
  ) {}

  async getAll() {
    return this.colorDogModel.find().exec();
  }
}
