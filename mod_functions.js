import {send_message, headers} from "./main_functions.js";

export const ban = async (msg) => {
  let guild_roles = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "GET", 
    headers: headers["get"]
  }).then(async (roles) => await roles.json())
  for (let i = 0; i < guild_roles.length; i++) {
    if (((guild_roles[i].permissions & 0x4) == 0x4 || (guild_roles[i].permissions & 0x8) == 0x8) && msg.member.roles.includes(guild_roles[i].id)) {
      for (let x = 0; x < msg.mentions.length; x++) {
        await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.mentions[x].id}`, {
          method: "DELETE",
          headers: headers["get"]
        })
        await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/bans/${msg.mentions[x].id}`, {
          method: "PUT",
          headers: headers["post"],
          body: JSON.stringify({delete_message_days: 7})
        })
        await send_message(`Banned ${msg.mentions[x].username}`, msg.channel_id);
      }
      return;
    }
  }
  await send_message(`You don't have permission to use that command, ${msg.author.username}`, msg.channel_id)
}

export const kick = async (msg) => {
  let guild_roles = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "GET", 
    headers: headers["get"]
  }).then(async (roles) => await roles.json())
  for (let i = 0; i < guild_roles.length; i++) {
    if (((guild_roles[i].permissions & 0x2) == 0x2 || (guild_roles[i].permissions & 0x8) == 0x8) && msg.member.roles.includes(guild_roles[i].id)) {
      for (let x = 0; x < msg.mentions.length; x++) {
        await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.mentions[x].id}`, {
          method: "DELETE",
          headers: headers["get"]
        })
        await send_message(`Kicked ${msg.mentions[x].username}`, msg.channel_id);
      }
      return;
    }
  }
  await send_message(`You don't have permission to use that command, ${msg.author.username}`, msg.channel_id)
}

export const mute = async (msg) => {
  let guild_roles = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "GET", 
    headers: headers["get"]
  }).then(async (roles) => await roles.json())
  for (let i = 0; i < guild_roles.length; i++) {
    if (((guild_roles[i].permissions & 0x400000) == 0x400000 || (guild_roles[i].permissions & 0x8) == 0x8) && msg.member.roles.includes(guild_roles[i].id)) {
      let date = new Date();
      date.setTime(date.getTime() + 3600000);
      for (let x = 0; x < msg.mentions.length; x++) {
        await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.mentions[x].id}`, {
          method: "PATCH",
          headers: headers["post"],
          body: JSON.stringify({communication_disabled_until: date})
        }).then(async r => await r.json())
        await send_message(`Muted ${msg.mentions[x].username}`, msg.channel_id);
      }
      return;
    }
  }
  await send_message(`You don't have permission to use that command, ${msg.author.username}`, msg.channel_id)
}

export const unmute = async (msg) => {
  let guild_roles = await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/roles`, {
    method: "GET", 
    headers: headers["get"]
  }).then(async (roles) => await roles.json())
  for (let i = 0; i < guild_roles.length; i++) {
    if (((guild_roles[i].permissions & 0x400000) == 0x400000 || (guild_roles[i].permissions & 0x8) == 0x8) && msg.member.roles.includes(guild_roles[i].id)) {
      for (let x = 0; x < msg.mentions.length; x++) {
        await fetch(`https://discord.com/api/v10/guilds/${msg.guild_id}/members/${msg.mentions[x].id}`, {
          method: "PATCH",
          headers: headers["post"],
          body: JSON.stringify({communication_disabled_until: null})
        }).then(async r => await r.json())
        await send_message(`Unmuted ${msg.mentions[x].username}`, msg.channel_id);
      }
      return;
    }
  }
  await send_message(`You don't have permission to use that command, ${msg.author.username}`, msg.channel_id)
}
