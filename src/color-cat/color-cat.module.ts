import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorCatController } from './color-cat.controller';
import { ColorCatModel } from './color-cat.model/color-cat.model';
import { ColorCatService } from './color-cat.service';

@Module({
  controllers: [ColorCatController],
  providers: [ColorCatService],
  imports: [
    MongooseModule.forFeature([{ name: 'ColorCat', schema: ColorCatModel }]),
  ],
})
export class ColorCatModule {}
