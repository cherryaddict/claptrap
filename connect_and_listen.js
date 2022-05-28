import {handlers} from "./handle_events.js";

let heartbeat;

const connect = async () => {
  let socket = new WebSocket("wss://gateway.discord.gg/api/v=10&encoding=json");
  socket.addEventListener("error", (e) => console.error(e));
  socket.addEventListener("close", async () => {
    clearInterval(heartbeat);
    console.log("server closed connection, attemting to reconnect...");
    await connect().catch(e => {
      console.error(e);
      close();
    });
  });
  socket.addEventListener("message", async (packet) => {
    let data = JSON.parse(packet.data);
    switch (data.op) {
      case 10:
        heartbeat = setInterval(() => socket.send(JSON.stringify({op: 1, d: null})), data.d.heartbeat_interval);
        socket.send(JSON.stringify({
          op: 2,
          d: {
            token: "BOT_TOKEN_GOES_HERE",
            intents: 16383,
            properties: {}
          }
        }));
        break;
      case 0:
        let handler = handlers.get(data.t);
        if (handler) await handler(data.d);
        break;
    }
  });
}

await connect();
