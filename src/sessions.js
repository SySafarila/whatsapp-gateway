import fs from "node:fs";
import path from "node:path";
import Whatsapp from "./whatsapp.js";

export const initializeCurrentSessions = () => {
  const sessions = fs.readdirSync(path.join(".wwebjs_auth"));
  sessions.forEach((session) => {
    const client_id = session.slice(8);

    new Whatsapp(client_id);
  });
};

initializeCurrentSessions();
