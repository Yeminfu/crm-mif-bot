import { pool } from "../db/connect.js"

export default async function getTokenByUser(userIdInTg) {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM employees WHERE tg_chat_id = ?",
            [userIdInTg],
            function (err, res) {
                if (err) {
                    console.log("err #8cj2m", err);
                }
                resolve(res?.pop()?.token)
            }
        )
    })
}
