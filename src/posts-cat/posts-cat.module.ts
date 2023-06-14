import { TelegramModule } from './../telegram/telegram.module';
import { PostsCatModel } from './posts-cat.model/posts-cat.model';
import { Module } from '@nestjs/common';
import { PostsCatService } from './posts-cat.service';
import { PostsCatController } from './posts-cat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModel } from 'src/telegram/telegram.model/telegram.model';

@Module({
  providers: [PostsCatService],
  controllers: [PostsCatController],
  imports: [
    MongooseModule.forFeature([
      { name: 'PostsCat', schema: PostsCatModel },
      { name: 'Telegram', schema: TelegramModel },
    ]),
    TelegramModule,
  ],
})
export class PostsCatModule {}
