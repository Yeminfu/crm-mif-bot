import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { setChatIdToUser } from './tools/setChatIdToUser.js';
import checkUserInBase from './tools/checkUserInBase.js';
import imageResender from './tools/imageResender.js';
import textResender from './tools/textResendex.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  console.log('incoming message');
  const chatId = msg.chat.id;
  const { id: idFromTGChat, username } = msg.chat;
  if (msg.text === '/start') {
    const inDb = await checkUserInBase(username);
    if (inDb) {
      const { username: usernameFromDB, id: idFromDB, tg_chat_id, ...isInBase } = inDb;
      if (!tg_chat_id) {
        bot.sendMessage(chatId, `Приветствую, ${usernameFromDB}`);
        const updated = await setChatIdToUser(idFromTGChat, idFromDB);
        if (updated) bot.sendMessage(chatId, 'Регистрация прошла успешно');;
      } else { bot.sendMessage(chatId, 'Уже знакомы'); }
    } else {
      bot.sendMessage(chatId, 'Вы кто такие? Я вас не знаю.');
    }
    console.log('inDb', inDb, msg);
  } else if (msg.photo && msg.caption) {
    imageResender(msg, bot);
  } else {
    textResender(msg, bot);
  }
});
