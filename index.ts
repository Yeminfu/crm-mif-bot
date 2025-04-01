import mysql from 'mysql2/promise';
import 'dotenv/config';
import sendMessage from './src/telegramApi/sendMessage/sendMessage';

console.log('hello');
const token = process.env.TOKEN;
console.log(token);


(async () => {


  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Выполнение запроса
    const [rows, fields] = await connection.execute('show tables');
    // sendMessage(5050441344, "manamana", String(token))

    // return;
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



