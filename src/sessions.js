import fs from "node:fs";
import path from "node:path";
import Whatsapp from "./whatsapp.js";

export const initializeCurrentSessions = () => {
  try {
    fs.readdir(path.join(".disconnected_clients"), (error, cb) => {
      if (error) {
        fs.mkdirSync(path.join(".disconnected_clients"));
      }
    });
    const disconnected_clients = fs.readdirSync(
      path.join(".disconnected_clients")
    );
    disconnected_clients.forEach((client_id) => {
      const client = client_id.split(".json")[0];
      fs.rmSync(path.join(`.wwebjs_auth/session-${client}`), {
        force: true,
        recursive: true,
      });
      fs.rmSync(path.join(`.disconnected_clients/${client_id}`), {
        force: true,
        recursive: true,
      });
    });

    const sessions = fs.readdirSync(path.join(".wwebjs_auth"));
    sessions.forEach((session) => {
      const client_id = session.slice(8);

      console.log(`Restoring session for ${client_id}`);
      new Whatsapp(client_id);
    });
  } catch (error) {
    console.log("sessions not found");
  }
};

export async function add_to_disconnected_list(client_id) {
  fs.readdir(path.join(".disconnected_clients"), (error, cb) => {
    if (error) {
      fs.mkdirSync(path.join(".disconnected_clients"));
    }
    fs.writeFileSync(path.join(`.disconnected_clients/${client_id}.json`), "");
  });
}
