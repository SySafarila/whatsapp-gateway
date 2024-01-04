import "dotenv/config";
import QRCode from "qrcode";
import wwebjs from "whatsapp-web.js";
import { set_client } from "./clients.js";
const { Client, LocalAuth } = wwebjs;
import { add_to_disconnected_list } from "./sessions.js";

export default class Whatsapp {
  /**
   *
   * @param {string} client_id
   * @returns client_id
   */
  constructor(client_id) {
    this.client_id = client_id;
    const client = new Client(this.options(this.client_id));

    client.on("qr", (qr) => {
      QRCode.toDataURL(qr, (er, url) => {
        console.log(`QRCode for ${this.client_id} is ready`);
        set_client(this.client_id, client, url, false);
      });
    });
    client.on("authenticated", (qr) => {
      console.log(`${this.client_id} authenticated`);
      set_client(this.client_id, client, null, true);
    });
    client.on("ready", () => {
      console.log(`${this.client_id} ready`);
    });
    client.on("message", (message) => {
      if (message.body == "!ping") {
        message.react("👋");
      }
    });
    client.on("disconnected", async (reason) => {
      try {
        set_client(this.client_id, client, null, false);
        await add_to_disconnected_list(this.client_id);
        console.log(`${this.client_id} disconnected`);
      } catch (error) {
        console.error(error);
      }
    });
    client.initialize();

    set_client(this.client_id, client, null, false);
  }

  /**
   *
   * @param {string} client_id
   * @returns object
   */
  options(client_id) {
    let clientOptions;
    if (process.env.IS_DOCKER == "true") {
      // for docker/linux
      clientOptions = {
        authStrategy: new LocalAuth({
          clientId: client_id,
        }),
        puppeteer: {
          executablePath: "/usr/bin/google-chrome",
          args: ["--disable-gpu", "--no-sandbox"],
        },
      };
    } else {
      // for windows
      clientOptions = {
        authStrategy: new LocalAuth({
          clientId: client_id,
        }),
      };
    }
    return clientOptions;
  }
}
