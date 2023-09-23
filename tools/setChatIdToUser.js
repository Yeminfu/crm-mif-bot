import { pool } from "../db/connect.js";

export async function setChatIdToUser(idFromTGChat, idFromDB) {
    return await new Promise(r => {
      pool.query(
        "UPDATE employees SET tg_chat_id = ? WHERE id = ?",
        [idFromTGChat, idFromDB],
        function (err, res) {
          console.log({ err, res });
          r(res.affectedRows);
        }
      )
    })
  }