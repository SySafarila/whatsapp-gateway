import "dotenv/config";
import express from "express";
import QRCode from "qrcode";
import whatsapp from "whatsapp-web.js";
const { Client, LocalAuth } = whatsapp;
const app = express();
const port = process.env.APP_PORT ?? 3000;
let whatsapp_qr_url = null;
let whatsapp_authenticated = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

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
app.post("/logout", (req, res) => {
  if (whatsapp_authenticated) {
    try {
      client.logout();
      return res.json("Logout success");
    } catch (error) {
      return res.json("logout failed");
    }
  }
  res.json("Not authenticated");
});
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

client.on("ready", () => {
  console.log("Whatsapp client is ready!");
});

client.on("authenticated", () => {
  whatsapp_authenticated = true;
  console.log("Whatsapp client is authenticated!");
});

client.on("qr", (qr) => {
  QRCode.toDataURL(qr, (err, url) => {
    whatsapp_qr_url = url;
  });
  console.log(`QR = ${qr}`);
});

client.initialize();

// send message to specific user number, start the number with country code and end it with "@c.us"
// client.sendMessage('6285155001528@c.us', 'your message here')
