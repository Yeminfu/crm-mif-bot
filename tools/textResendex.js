import getTokenByUser from "./getTokenByUser.js";

export default async function textResender(msg, bot) {
    const chatId = msg.chat.id;

    const token = await getTokenByUser(chatId);
    if (!token) return;

    const text = msg.text;
    const [firstRow, ...otherRows] = text.split("\n")

    if (!otherRows?.length) {
        bot.sendMessage(
            5050441344,
            JSON.stringify({
                что_случилось: "фуфел тулят #ff4",
                msg
            }, null, 2)
        )
        return;
    }

    const [essenseRus, essenseId] = firstRow.split(" ");

    const essenses = {
        заказ: "lead",
    };
    const essense = essenses[essenseRus.toLowerCase()];

    if (!essense) { bot.sendMessage(chatId, `Некорректный формат`); return; }
    if (!essenseId) { bot.sendMessage(chatId, `Некорректный формат`); return; }

    const newMessage = otherRows.join("\n");

    sendMessage(token, "lead", essenseId, newMessage)
}



function sendMessage(token, essense, essenseId, text) {
    return new Promise(async (resolve, reject) => {

        const formData = new FormData();

        formData.append('text', 'Отправлено через через телеграм бот\n\n' + text);
        formData.append('essense', essense);
        formData.append('essense_id', essenseId);

        await fetch(`${process.env.SERVER}/api/messages/send`, {
            method: 'POST',
            body: formData,
            headers: {
                Cookie: `auth=${token}`
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