import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BreadCat, BreadCatDocument } from './bread-cat.model/bread-cat.model';

@Injectable()
export class BreadCatService {
  constructor(
    @InjectModel(BreadCat.name)
    private readonly breadCatModel: Model<BreadCatDocument>,
  ) {}

  async getAll() {
    return this.breadCatModel.find().exec();
  }
}
