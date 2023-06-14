import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (): ITelegramOptions => ({
  // https://api.telegram.org/bot6064734898:AAEGfTUA2Ugn7KWh6vLpFrbbefpYnxhrk8s/getUpdates - for get chatId
  chatId: '6089606292',
  token: '6064734898:AAEGfTUA2Ugn7KWh6vLpFrbbefpYnxhrk8s',
});
