import { BreadDogDocument, BreadDog } from './bread-dog.model/bread-dog.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class BreadDogService {
  constructor(
    @InjectModel(BreadDog.name)
    private readonly breadDogModel: Model<BreadDogDocument>,
  ) {}

  async getAll() {
     return this.breadDogModel.find().exec();
  }
}
