import cors from "cors";
import "dotenv/config";
import express from "express";
import {
  login,
  login_get,
  logout,
  root,
  send_message,
} from "./src/callbacks/backend.js";
import {
  authenticated,
  disconnected,
  message,
  qr,
  ready,
} from "./src/callbacks/whatsapp.js";
import { client as whatsapp } from "./src/clients.js";
import { verify_token } from "./src/middlewares.js";

const app = express();
const port = process.env.APP_PORT ?? 3000;

// express
app.use(express.json());
app.use(cors());
app.use(verify_token);
app.get("/", root);
app.post("/login", login);
app.get("/login", login_get);
app.post("/logout", logout);
app.post("/send-message", send_message);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// whatsapp
whatsapp.on("qr", qr);
whatsapp.on("authenticated", authenticated);
whatsapp.on("ready", ready);
whatsapp.on("message", message);
whatsapp.on("disconnected", disconnected);
whatsapp.initialize();
