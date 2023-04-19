import { BreadDogModel } from './bread-dog.model/bread-dog.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BreadDogService } from './bread-dog.service';
import { BreadDogController } from './bread-dog.controller';

@Module({
  providers: [BreadDogService],
  controllers: [BreadDogController],
  imports: [
    MongooseModule.forFeature([{ name: 'BreadDog', schema: BreadDogModel }]),
  ],
})
export class BreadDogModule {}
