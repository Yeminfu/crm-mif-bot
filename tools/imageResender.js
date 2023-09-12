import getTokenByUser from './getTokenByUser.js';
import 'dotenv/config';

console.log('server', process.env.SERVER);

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

const essenses = {
  заказ: "lead",
};

export default async function imageResender(msg, bot) {


  const [firstRow, ...otherRows] = msg.caption.split("\n");

  const [essenseRus, essenseId] = firstRow.split(" ");


  const description = (otherRows?.length) ? otherRows.join("\n") : "";

  const essense = essenses[essenseRus.toLowerCase()];
  if (!essense || !essenseId) {
    bot.sendMessage(
      5050441344,
      JSON.stringify({
        что_случилось: "фуфел тулят #vd6",
        msg
      }, null, 2)
    )
    return;
  }

  const chatId = msg.chat.id;

  const token = await getTokenByUser(chatId);
  if (!token) return;

  const photo = msg.photo[msg.photo.length - 1];
  const fileId = photo.file_id;
  bot.getFile(fileId).then((fileInfo) => {
    const fileUrl = `https://api.telegram.org/file/bot${telegramToken}/${fileInfo.file_path}`;
    sendMessage(fileUrl, 'saved_image.jpg', token, essense, essenseId, description).then(() => {
      bot.sendMessage(chatId, 'Изображение сохранено');
    }).catch((error) => {
      bot.sendMessage(chatId, `Произошла ошибка при сохранении изображения: ${error}`);
    });
  }).catch((error) => {
    bot.sendMessage(chatId, `Произошла ошибка при получении информации о файле: ${error}`);
  });
}

function sendMessage(url, fileName, token, essense, essenseId, description) {
  return new Promise(async (resolve, reject) => {

    const formData = new FormData();

    formData.append('text', 'Отправлено через через телеграм бот\n' + description);
    formData.append('essense', essense);
    formData.append('essense_id', essenseId);

    const blob = await fetch(url).then((response) => response.blob())

    const file = new File([blob], fileName, { type: blob.type });

    formData.append('images', file);

    await fetch(`${process.env.SERVER}/api/messages/send`, {
      method: 'POST',
      body: formData,
      headers: {
        Cookie: `auth=${token}`
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

    resolve('0');

  });
}