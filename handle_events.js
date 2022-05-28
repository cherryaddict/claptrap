import {increment_post_count, welcome, headers} from "./main_functions.js";
import {cmds} from "./cmds.js";

const handle_message_event = async (msg) => {
  if (msg.author.bot) return;
  await increment_post_count(msg);
  let cmd = cmds.get(msg.content.split(" ")[0]);
  if (cmd) await fetch(`https://discord.com/api/v10/channels/${msg.channel_id}/messages/${msg.id}`, {
    method: "DELETE",
    headers: headers["get"]
  }).then(async () => await cmd(msg));
}

export const handlers = new Map([
  ["READY", console.log("Ready!")],
  ["GUILD_MEMBER_ADD", welcome],
  ["MESSAGE_CREATE", handle_message_event]
])
