import { clients, set_client } from "../clients.js";
import wa from "../whatsapp.js";
import { add_to_disconnected_list } from "../sessions.js";

export const root = (req, res) => {
  res.json("Hello world!");
};

export const login_get = (req, res) => {
  try {
    const { client_id } = req.body;
    if (!client_id) {
      res.status(400);
      return res.json("client_id is required");
    }
    if (!clients[client_id]) {
      new wa(client_id);
      return res.json(`creating new client with id: ${client_id}`);
    }
    if (clients[client_id].qr == null && clients[client_id].auth == true) {
      return res.json(`${client_id} is already authenticated & active`);
    }
    if (clients[client_id].qr == null) {
      return res.json(`QRCode for ${client_id} is not ready yet`);
    }
    res.send(`<img src="${clients[client_id]?.qr ?? "x"}" />`);
  } catch (error) {
    res.status(500);
    return res.json("Internal server error");
  }
};

export const logout = async (req, res) => {
  try {
    const { client_id } = req.body;
    if (!clients[client_id]) {
      res.status(404);
      return res.json("client_id not found");
    }
    if (clients[client_id].auth == true) {
      await clients[client_id].client.logout();

      set_client(client_id, clients[client_id].client, null, false);
      await add_to_disconnected_list(client_id);

      return res.json("logout success");
    }
  } catch (error) {
    res.status(500);
    return res.json("Internal server error");
  }
};

export const send_message = async (req, res) => {
  const { phone_number, message, client_id } = req.body;
  if (!phone_number || !message || !client_id) {
    // validate requests
    res.status(400);
    return res.json("{phone_numnber} or {message} are required");
  }

  if (!clients[client_id]) {
    res.status(400);
    return res.json("client_id is not available yet");
  }

  try {
    const wx = clients[client_id].client;
    // sending message
    const send = await wx.sendMessage(`${phone_number}@c.us`, message);
    console.log(`SEND STATUS: ${send.fromMe}`);
    return res.json(`SEND STATUS: ${send.fromMe}`);
  } catch (error) {
    res.status(400);
    return res.json(`Failed, error: ${error.message}`);
  }
};
