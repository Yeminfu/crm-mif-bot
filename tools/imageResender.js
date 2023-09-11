import fs from "fs";
import https from "https"
export default async function imageResender(msg, bot) {
    // console.log('imageResender', msg);
    const chatId = msg.chat.id;

    const token = process.env.TELEGRAM_BOT_TOKEN;

    // Проверяем, есть ли в сообщении изображение
    if (msg.photo) {
        // Получаем информацию о самом последнем изображении
        const photo = msg.photo[msg.photo.length - 1];

        // Получаем идентификатор файла изображения
        const fileId = photo.file_id;

        // Запрашиваем информацию о файле изображения
        bot.getFile(fileId).then((fileInfo) => {
            // Получаем URL файла изображения
            const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;

            // Сохраняем изображение
            saveImage(fileUrl, 'saved_image.jpg').then(() => {
                // Отправляем ответное сообщение с подтверждением сохранения
                bot.sendMessage(chatId, 'Изображение сохранено');
            }).catch((error) => {
                // В случае ошибки отправляем сообщение с ошибкой
                bot.sendMessage(chatId, `Произошла ошибка при сохранении изображения: ${error}`);
            });
        }).catch((error) => {
            // В случае ошибки отправляем сообщение с ошибкой
            bot.sendMessage(chatId, `Произошла ошибка при получении информации о файле: ${error}`);
        });
    }
}

// Функция для сохранения изображения
function saveImage(url, fileName) {
    return new Promise((resolve, reject) => {
      // Отправляем GET-запрос для загрузки изображения
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