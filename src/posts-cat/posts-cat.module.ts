import { PostsCatModel } from './posts-cat.model/posts-cat.model';
import { Module } from '@nestjs/common';
import { PostsCatService } from './posts-cat.service';
import { PostsCatController } from './posts-cat.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [PostsCatService],
  controllers: [PostsCatController],
  imports: [
    MongooseModule.forFeature([{ name: 'PostsCat', schema: PostsCatModel }]),
  ],
})
export class PostsCatModule {}
