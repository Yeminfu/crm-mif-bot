import { pool } from "../db/connect.js"

export default async function getTokenByUser(userIdInTg) {
    return await new Promise(resolve => {
        pool.query(
            `SELECT * 
            FROM tokens 
            WHERE 
            user IN (SELECT id FROM employees WHERE tg_chat_id =?)
            AND deadline > now()
            `,
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
