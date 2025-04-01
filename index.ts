import mysql from 'mysql2/promise';
import 'dotenv/config';

console.log('hello');
const token = process.env.TOKEN;
console.log(token);

const url = `https://api.telegram.org/bot${token}/sendMessage`;

(async () => {

  sendMessage(5050441344, "чсч")

  return;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Выполнение запроса
    const [rows, fields] = await connection.execute('SELECT * FROM your_table');

    // Вывод результатовq
    console.log(rows);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  } finally {
    // Закрытие подключения
    await connection.end();
  }

})()
// /home/zuacer/Desktop/work/motohit/crm-mif-bot/build/index.js



async function sendMessage(chatId: number, message: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    // Проверка ответа
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    console.log('Сообщение отправлено:', data);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
}