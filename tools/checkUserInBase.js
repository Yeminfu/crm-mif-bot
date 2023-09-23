import { pool } from "../db/connect.js";
console.log('pool', pool);
export default async function checkUserInBase(username) {
    console.log('username $ks', username);
    return await new Promise(r => {
        pool.query(
            "SELECT * FROM employees WHERE telegram_id = ?",
            [username],
            function (err, res) {
                if (err) {
                    console.log('err #z3da', err);
                }
                r(res[0]);
            }
        )
    })
}
