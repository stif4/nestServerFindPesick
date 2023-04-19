import { Module } from '@nestjs/common';
import { PostsDogService } from './posts-dog.service';
import { PostsDogController } from './posts-dog.controller';
import { PostsDogModel } from './posts-dog.model/posts-dog.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [PostsDogService],
  controllers: [PostsDogController],
  imports: [
    MongooseModule.forFeature([{ name: 'PostsDog', schema: PostsDogModel }]),
  ],
})
export class PostsDogModule {}
