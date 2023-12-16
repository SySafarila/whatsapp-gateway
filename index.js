import cors from "cors";
import "dotenv/config";
import express from "express";
import { login, logout, root, send_message } from "./src/callbacks/backend.js";
import {
  authenticated,
  disconnected,
  message,
  qr,
  ready,
} from "./src/callbacks/whatsapp.js";
import { client as whatsapp } from "./src/clients.js";

const app = express();
const port = process.env.APP_PORT ?? 3000;

// express
app.use(express.json());
app.use(cors());
app.get("/", root);
app.post("/login", login);
app.post("/logout", logout);
app.post("/send-message", send_message);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// whatsapp
whatsapp.on("ready", ready);
whatsapp.on("authenticated", authenticated);
whatsapp.on("disconnected", disconnected);
whatsapp.on("qr", qr);
whatsapp.on("message", message);
whatsapp.initialize();
