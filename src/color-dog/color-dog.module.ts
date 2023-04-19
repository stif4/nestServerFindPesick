import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorDogController } from './color-dog.controller';
import { ColorDogModel } from './color-dog.model/color-dog.model';
import { ColorDogService } from './color-dog.service';

@Module({
  controllers: [ColorDogController],
  providers: [ColorDogService],
  imports: [
    MongooseModule.forFeature([{ name: 'ColorDog', schema: ColorDogModel }]),
  ],
})
export class ColorDogModule {}
