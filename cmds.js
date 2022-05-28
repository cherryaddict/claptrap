import {pong} from "./user_functions.js";
import {kick, ban, mute, unmute} from "./mod_functions.js";
import {install, set_welcome_channel} from "./main_functions.js";

export const cmds = new Map([
  [".install", install],
  [".welcome", set_welcome_channel],
  ['.ban', ban],
  ['.kick', kick],
  ['.mute', mute],
  ['.unmute', unmute],
  [".ping", pong]
]);
