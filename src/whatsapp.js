import "dotenv/config";
import QRCode from "qrcode";
import wwebjs from "whatsapp-web.js";
import { add_client } from "./clients.js";
const { Client, LocalAuth } = wwebjs;

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
        console.log(`QRCode for ${this.client_id} is ready`);
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
    client.on("disconnected", async (reason) => {
      try {
        add_client(this.client_id, client, null, false);
        client.initialize();
        console.log(`${this.client_id} disconnected`);
      } catch (error) {
        //
      }
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
