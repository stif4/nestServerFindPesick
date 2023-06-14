import { Module } from '@nestjs/common';
import { session } from 'telegraf';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModel } from './telegram.model/telegram.model';
const sessionMiddleware = session();

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessionMiddleware],
      token: '6064734898:AAEGfTUA2Ugn7KWh6vLpFrbbefpYnxhrk8s',
    }),
    MongooseModule.forFeature([{ name: 'Telegram', schema: TelegramModel }]),
  ],

  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
