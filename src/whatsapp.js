import "dotenv/config";
import wwebjs from "whatsapp-web.js";
const { Client, LocalAuth } = wwebjs;
import { add_client } from "./clients.js";
import QRCode from "qrcode";

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
      let qrr;
      QRCode.toDataURL(qr, (er, url) => {
        qrr = url;
        console.log(`${this.client_id} QR: ${url}`);
        add_client(this.client_id, client, url, false);
      });
    });
    client.on("authenticated", (qr) => {
      console.log(`${this.client_id} authenticated`);
      add_client(this.client_id, client, null, true);
    });
    client.on("ready", () => {
      console.log(`${this.client_id} ready`);
    });
    client.on("message", (message) => {
      if (message.body == "!ping") {
        message.react("👋");
      }
    });
    client.on("disconnected", () => {
      console.log(`${this.client_id} ready`);
      add_client(this.client_id, client, null, false);
    });
    client.initialize();

    add_client(this.client_id, client, null, false);
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
