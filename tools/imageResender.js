const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

export default async function imageResender(msg, bot) {
  const chatId = msg.chat.id;

  if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    bot.getFile(fileId).then((fileInfo) => {
      const fileUrl = `https://api.telegram.org/file/bot${telegramToken}/${fileInfo.file_path}`;
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
  return new Promise(async (resolve, reject) => {

    const formData = new FormData();

    formData.append('text', 'здравствуйте');
    formData.append('essense', 'lead');
    formData.append('essense_id', '1');

    const blob = await fetch(url).then((response) => response.blob())

    const file = new File([blob], 'fileName.jpeg', { type: blob.type });

    formData.append('images', file);

    await fetch(`${process.env.SERVER}/api/messages/send`, {
      method: 'POST',
      body: formData,
      headers: {
        Cookie: `auth=1x4Wz1Rum0YsxxEtT7rR`
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