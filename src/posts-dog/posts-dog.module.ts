import { Module } from '@nestjs/common';
import { PostsDogService } from './posts-dog.service';
import { PostsDogController } from './posts-dog.controller';
import { PostsDogModel } from './posts-dog.model/posts-dog.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from '../telegram/telegram.module';
import { TelegramModel } from '../telegram/telegram.model/telegram.model';

@Module({
  providers: [PostsDogService],
  controllers: [PostsDogController],
  imports: [
    MongooseModule.forFeature([
      { name: 'PostsDog', schema: PostsDogModel },
      { name: 'Telegram', schema: TelegramModel },
    ]),
    TelegramModule,
  ],
})
export class PostsDogModule {}
