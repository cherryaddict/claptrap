export const headers = {
  "get": {"Authorization": "Bot BOT_TOKEN_GOES_HERE"},
  "post": {"Authorization": "Bot BOT_TOKEN_GOES_HERE","Content-Type": "application/json"},
};

export let guild_data = await Deno.readTextFile("./guild_data.json").then(text => JSON.parse(text)).catch(async () => await Deno.writeTextFile("./guild_data.json", JSON.stringify({})));
if (!guild_data) guild_data = {};
setInterval(async () => {
  await Deno.writeTextFile("./guild_data.json", JSON.stringify(guild_data));
}, 60000);

export const send_message = async (content, channel) => {
  return await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, {
    method: "POST",
    headers: headers["post"],
    body: JSON.stringify({"content": content, "tts": false})
  });
};

export const welcome = async (member) => {
  if (guild_data[member.guild_id].welcome_channel.length) await send_message(`Welcome **${member.user.username}**`, guild_data[member.guild_id].welcome_channel);
};

export const set_welcome_channel = async (msg) => {
  guild_data[msg.guild_id].welcome_channel = msg.channel_id;
  await Deno.writeTextFile("./guild_data.json", JSON.stringify(guild_data));
  await send_message("Set this as the welcome channel", msg.channel_id);
};

export const install = async (msg) => {
  if (guild_data[msg.guild_id].welcome_channel.length) return send_message("Already installed!");
  let noobie = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "POST",
    headers: headers["post"],
    body: JSON.stringify({"name": "noobie", "color": 8178139, "hoist": true})
  }).then(async r => await r.json());
  let regular = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "POST",
    headers: headers["post"],
    body: JSON.stringify({"name": "regular", "color": 6583504, "hoist": true})
  }).then(async r => await r.json());
  let veteran = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "POST",
    headers: headers["post"],
    body: JSON.stringify({"name": "veteran", "color": 11697117, "hoist": true})
  }).then(async r => await r.json());
  let mute = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "POST",
    headers: headers["post"],
    body: JSON.stringify({"name": "muted"})
  }).then(async r => await r.json());
  guild_data[msg.guild_id].level_up_roles["noobie"] = noobie.id;
  guild_data[msg.guild_id].level_up_roles["regular"] = regular.id;
  guild_data[msg.guild_id].level_up_roles["veteran"] = veteran.id;
  guild_data[msg.guild_id].mute_role = mute.id;
  await Deno.writeTextFile("./guild_data.json", JSON.stringify(guild_data));
  await send_message("Installed! You may wish to adjust the position of the created roles. Type `.welcome` in the channel you want welcome message to appear in", msg.channel_id);
};

const level_up_role = async (msg) => {
  let user = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.author.id}`, {
    method: "GET",
    headers: headers["get"]
  }).then(async r => await r.json());
  let new_role = "regular";
  let old_role = "noobie";
  if (user.roles.includes(guild_data[msg.guild_id].level_up_roles["regular"])) {new_role = "veteran"; old_role = "regular"};
  user.roles.push(guild_data[msg.guild_id].level_up_roles[new_role]);
  user.roles.splice(user.roles.indexOf(guild_data[msg.guild_id].level_up_roles[old_role]), 1);
  await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.author.id}`, {
    method: "PATCH",
    headers: headers["post"],
    body: JSON.stringify({roles: user.roles})
  });
};

export const increment_post_count = async (msg) => {
  if (!guild_data[msg.guild_id]) guild_data[msg.guild_id] = {users: {}, level_up_roles: {}, welcome_channel: ""};
  if (!guild_data[msg.guild_id].users[msg.author.id]) guild_data[msg.guild_id].users[msg.author.id] = {posts: 1};
  else guild_data[msg.guild_id].users[msg.author.id].posts++;
  if (guild_data[msg.guild_id].users[msg.author.id].posts === 500) level_up_role(msg);
  else if (guild_data[msg.guild_id].users[msg.author.id].posts === 3000) level_up_role(msg);
};
