import fs from "fs";
import https from "https"
export default async function imageResender(msg, bot) {
  const chatId = msg.chat.id;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    bot.getFile(fileId).then((fileInfo) => {
      const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
      saveImage(fileUrl, 'saved_image.jpg').then(() => {
        bot.sendMessage(chatId, 'Изображение сохранено');
      }).catch((error) => {
        bot.sendMessage(chatId, `Произошла ошибка при сохранении изображения: ${error}`);
      });
    }).catch((error) => {
      bot.sendMessage(chatId, `Произошла ошибка при получении информации о файле: ${error}`);
    });
  }
}

function saveImage(url, fileName) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileName);
    const request = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (error) => {
      fs.unlink(fileName);
      reject(error);
    });
  });
}