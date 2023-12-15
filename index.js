import cors from "cors";
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
  // for docker/linux host
  client = new Client({
    authStrategy: new LocalAuth(),
    // remove comments below for docker
    puppeteer: {
      executablePath: "/usr/bin/google-chrome",
      args: ["--disable-gpu", "--no-sandbox"],
    },
  });
} else {
  // for other host
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
app.use(cors());
app.get("/", (req, res) => {
  res.json("Hello world!");
});
app.post("/login", (req, res) => {
  if (whatsapp_authenticated) {
    return res.json("already authenticated");
  }
  res.json(
    {
      image_src: whatsapp_qr_url,
    } ?? "Qr not ready yet"
  );
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
      res.status(500);
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
    res.status(400);
    return res.json("{phone_numnber} or {message} are required");
  }

  try {
    // sending message
    const send = await client.sendMessage(`${phone_number}@c.us`, message);
    console.log(`SEND STATUS: ${send.fromMe}`);
    return res.json(`SEND STATUS: ${send.fromMe}`);
  } catch (error) {
    res.status(400);
    return res.json(`Failed, error: ${error.message}`);
  }
});

// whatsapp
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// done
client.on("ready", () => {
  // the client is ready to send and receive messages
  console.log("Whatsapp client is ready!");
  client.setStatus("!ping");
});

// done
client.on("authenticated", () => {
  // the client is authenticated
  whatsapp_authenticated = true;
  console.log("Whatsapp client is authenticated!");
});

// done
client.on("disconnected", async (reason) => {
  // the client is disconnected
  console.log(`Client disconnected with reason: ${reason}`);
  whatsapp_qr_url = null;
  whatsapp_authenticated = false;
  client.initialize();
});

// done
client.on("qr", (qr) => {
  // the client is not authenticated and you can receive QRCode from '/login'
  QRCode.toDataURL(qr, (err, url) => {
    whatsapp_qr_url = url;
  });
  console.log(`QR = ${qr}`);
});

// done
client.on("message", (message) => {
  // receiving message
  if (message.body == "!ping") {
    // reacting to received message
    message.react("👋");
  }
});

client.initialize();

// send message to specific user number, start the number with country code and end it with "@c.us"
// client.sendMessage('6285155001528@c.us', 'your message here')
