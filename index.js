import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { setChatIdToUser } from './tools/setChatIdToUser.js';
import getTokenByUser from './tools/getTokenByUser.js';
import checkUserInBase from './tools/checkUserInBase.js';
import fs from "fs";
import imageResender from './tools/imageResender.js';



// (async () => {
//   const image = "https://api.telegram.org/file/bot6587789796:AAGIpcrEcVZjL1XRL2q7PvYsXBXqb0fSDd0/photos/file_1.jpg";
//   sendImageToChat(image, "5050441344");
// })()

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  // console.log('msg');
  const chatId = msg.chat.id;
  const { id: idFromTGChat, username } = msg.chat;
  if (msg.text === '/start') {
    const inDb = await checkUserInBase(username); if (inDb) { const { username: usernameFromDB, id: idFromDB, tg_chat_id, ...isInBase } = inDb; if (!tg_chat_id) { bot.sendMessage(chatId, `Приветствую, ${usernameFromDB}`); const updated = await setChatIdToUser(idFromTGChat, idFromDB); if (updated) bot.sendMessage(chatId, 'Регистрация прошла успешно');; } else { bot.sendMessage(chatId, 'Уже знакомы'); } } else { bot.sendMessage(chatId, 'Вы кто такие? Я вас не знаю.'); }
  }
  // console.log('msg', msg);
  
  if (!(msg.photo && msg.caption)) {
    console.log('нихуя не пришло');
  }
  
  if (msg.photo && msg.caption) {
    imageResender(msg,bot);
    // console.log('пришла картинка с подписью', msg.photo, msg.caption);
  }

});


async function sendImageToChat(image, userIdInTg) {

  const token = await getTokenByUser(userIdInTg);

  if (!token) { console.log('err #i4nd8'); return; }

  const response = await fetch(image);
  const imageBuffer = await response.arrayBuffer();

  console.log('imageBuffer', imageBuffer);

  const formData = new FormData();

  formData.append('text', 'здравствуйте');
  formData.append('essense', 'lead');
  formData.append('essense_id', '1');

  formData.append('images', new Blob([imageBuffer]), 'image.jpg');


  // console.log('buffer', buffer);
  const cookie = `auth=${token}`;

  await fetch(`${process.env.SERVER}/api/messages/send`, {
    method: 'POST',
    body: formData,
    headers: {
      // 'Content-Type': 'image/jpeg', // Замените на соответствующий тип изображения
      Cookie: cookie
    },
  }).then(x => {
    console.log('x.ok', x.ok);
    console.log('x.status', x.status);
    console.log('x.statusText', x.statusText);
    return x.text();
  })
    .then(x => {
      console.log('x', x);
    });

  return;

  // console.log('token', token);
  // return;

  // console.log('image', image);
  // console.log('userIdInTg', userIdInTg);
  const formdata = new FormData();
  formdata.append("text", "data.text");
  formdata.append("essense", "lead");
  formdata.append("essense_id", 2);
  // const images = data.images;
  // for (let i = 0; i < images.length; i++) {
  //   formdata.append('images', images[i]);
  // }

  // const cookie = `auth=${token}`;

  fetch(
    `${process.env.SERVER}/api/messages/send`,
    {
      method: "POST",
      body: formdata,
      headers: {
        Cookie: cookie
      }
    })
    .then(x => {
      console.log('x.ok', x.ok);
      console.log('x.status', x.status);
      console.log('x.statusText', x.statusText);
      return x.text();
    })
    .then(x => {
      console.log('x', x);
    })

}
