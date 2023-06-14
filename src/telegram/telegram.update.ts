import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Update, InjectBot } from 'nestjs-telegraf';
import { Start } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Telegram, TelegramDocument } from './telegram.model/telegram.model';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectModel(Telegram.name)
    private readonly telegramModel: Model<TelegramDocument>,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    const alredyExists = await this.telegramModel.find({
      username: ctx.message.from.username,
    });

    if (!alredyExists.length) {
      await this.telegramModel.create({
        chatId: ctx.message.from.id,
        username: ctx.message.from.username,
      });
    }

    await ctx.reply(
      'Отлично, вы подписались на уведомления! Если ваш питомец будет найден, мы объязательно сообщим.',
    );
  }

  // @Command('quit')
  // async leaveCommand(ctx: Context) {
  //   console.log(ctx.message.chat.id);
  //   await ctx.telegram.leaveChat(ctx.message.chat.id);
  // }
}
