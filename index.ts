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

  const res = await getSales(connection);

  const json = JSON.stringify(res);

  sendMessage(5050441344, 'zzz', String(token))

  console.log(res);


  await connection.end();
  return;

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





async function getSales(connection: any): Promise<{ год: number, месяц: number, товар: string, магазин: string, 'к-во': number }[]> {
  // const connection = await dbConnection();
  const qs = `
    select
      P.name as товар
      /*,P.idCategory idКатегории*/
      /*,S.idShop*/
      ,Sh.shopName as магазин
      ,sum(S.count) AS 'к-во'
      ,sum(S.sum) AS сумма
    from chbfs_sales S
      inner join chbfs_shops Sh on Sh.id = S.idShop
        inner join chbfs_products P on P.id = S.idProduct
          inner join chbfs_categories C on C.id = P.idCategory
    where S.created_date >= CURDATE()
      
    group by
      P.name 
      /*,P.idCategory*/
      ,S.idShop
      ,Sh.shopName
    order by магазин, товар;
  `;
  const res = await connection.query(qs)
    .then(([x]: any) => x)
  // .then(x => x[0]);
  // await connection.end();
  return res;
}