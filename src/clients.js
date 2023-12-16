import "dotenv/config";
import whatsapp from "whatsapp-web.js";
import Status from "./status.js";
const { Client, LocalAuth } = whatsapp;

let clientOptions;
if (process.env.IS_DOCKER == "true") {
  // for docker/linux
  clientOptions = {
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: "/usr/bin/google-chrome",
      args: ["--disable-gpu", "--no-sandbox"],
    },
  };
} else {
  // for windows
  clientOptions = {
    authStrategy: new LocalAuth(),
  };
}

// for docker/linux host
export const client = new Client(clientOptions);
export const status = new Status();
