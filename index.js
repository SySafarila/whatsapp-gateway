import cors from "cors";
import "dotenv/config";
import express from "express";
import {
  login_get,
  logout,
  root,
  send_message,
} from "./src/callbacks/backend.js";
import { verify_token } from "./src/middlewares.js";
import { initializeCurrentSessions } from "./src/sessions.js";

const app = express();
const port = process.env.APP_PORT ?? 3000;

// express
app.use(express.json());
app.use(cors());
// app.use(verify_token);
app.get("/", root);
app.get("/login", login_get);
app.post("/logout", logout);
app.post("/send-message", send_message);
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

initializeCurrentSessions();
