# claptrap
A no-library, multi-server discord bot made with Deno. 

#### To use claptrap in your server:
- Install [Deno](https://deno.land/)
- Download all the JS files from this repo and place them in a folder
- Replace the three instances of `BOT_TOKEN_GOES_HERE` with your bot token
- Open terminal/cmd in the folder you placed the files in
- Run this command: ```deno run --allow-read --allow-write --allow-net connect_and_listen.js```
- In your server, type `.install` to set the level-up roles up and `.welcome` in the channel you want welcome messages to appear in

#### Features
- No dependency on a library
- Basic mod commands (ban, kick, mute, unmute)
- May add more example user commands in future (games/interactions)
