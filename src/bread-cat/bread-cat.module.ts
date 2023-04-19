import { Module } from '@nestjs/common';
import { BreadCatService } from './bread-cat.service';
import { BreadCatController } from './bread-cat.controller';
import { BreadCatModel } from './bread-cat.model/bread-cat.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [BreadCatService],
  controllers: [BreadCatController],
  imports: [
    MongooseModule.forFeature([{ name: 'BreadCat', schema: BreadCatModel }]),
  ],
})
export class BreadCatModule {}
