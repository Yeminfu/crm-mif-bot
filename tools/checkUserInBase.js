import { pool } from "../db/connect.js";

export default async function checkUserInBase(username) {
    return await new Promise(r => {
        pool.query(
            "SELECT * FROM employees WHERE telegram_id = ?",
            [username],
            function (err, res) {
                r(res[0]);
            }
        )
    })
}
