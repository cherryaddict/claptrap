import {send_message, headers} from "./main_functions.js";

export const pong = async (msg) => {
  let message = await send_message("Pong!", msg.channel_id).then(async r => await r.json());
  let start = new Date(msg.timestamp);
  let end = new Date(message.timestamp);
  await fetch(`https://discord.com/api/v10/channels/${msg.channel_id}/messages/${message.id}`, {
    method: "PATCH", 
    headers: headers["post"], 
    body: JSON.stringify({"content": `Pong! Completed in **${end - start}ms**`, "tts": false})
  });
};
