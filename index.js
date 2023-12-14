import "dotenv/config";
import express from "express";
import QRCode from "qrcode";
import whatsapp from "whatsapp-web.js";
const { Client, LocalAuth } = whatsapp;
const app = express();
const port = process.env.APP_PORT ?? 3000;
let whatsapp_qr_url = null;
let whatsapp_authenticated = false;
let client;

if (process.env.IS_DOCKER == "true") {
  client = new Client({
    authStrategy: new LocalAuth(),
    // remove comments below for docker
    puppeteer: {
      executablePath: "/usr/bin/google-chrome",
      args: ["--disable-gpu", "--no-sandbox"],
    },
  });
} else {
  client = new Client({
    authStrategy: new LocalAuth(),
    // remove comments below for docker
    // puppeteer: {
    //   executablePath: "/usr/bin/google-chrome",
    //   args: ["--disable-gpu", "--no-sandbox"],
    // },
  });
}

// express
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Hello world!");
});
app.post("/login", (req, res) => {
  if (whatsapp_authenticated) {
    return res.json("already authenticated");
  }
  res.json(whatsapp_qr_url ?? "Qr not ready yet");
});

// done
app.post("/logout", async (req, res) => {
  if (whatsapp_authenticated) {
    try {
      await client.logout();
      client.initialize();
      whatsapp_authenticated = false;
      whatsapp_qr_url = null;
      console.log("logout success");
      return res.json("Logout success");
    } catch (error) {
      return res.json("logout failed");
    }
  }
  res.json("Not authenticated");
});

// done
app.post("/send-message", async (req, res) => {
  if (!whatsapp_authenticated) {
    return res.json("Not authenticated");
  }

  const { phone_number, message } = req.body;
  if (!phone_number || !message) {
    return res.json("{phone_numnber} or {message} are required");
  }

  try {
    const send = await client.sendMessage(`${phone_number}@c.us`, message);
    console.log(`SEND STATUS: ${send.fromMe}`);
    return res.json(`SEND STATUS: ${send.fromMe}`);
  } catch (error) {
    return res.json(`Failed, error: ${error.message}`);
  }
});

// whatsapp
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// done
client.on("ready", () => {
  console.log("Whatsapp client is ready!");
});

// done
client.on("authenticated", () => {
  whatsapp_authenticated = true;
  console.log("Whatsapp client is authenticated!");
});

// done
client.on("disconnected", async (reason) => {
  console.log(`Client disconnected with reason: ${reason}`);
  whatsapp_qr_url = null;
  whatsapp_authenticated = false;
  client.initialize();
});

// done
client.on("qr", (qr) => {
  QRCode.toDataURL(qr, (err, url) => {
    whatsapp_qr_url = url;
  });
  console.log(`QR = ${qr}`);
});

// client.on('auth_failure', () => {
//   console.error('auth failure')
// })

client.initialize();

// send message to specific user number, start the number with country code and end it with "@c.us"
// client.sendMessage('6285155001528@c.us', 'your message here')
