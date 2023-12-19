// import { status, client as whatsapp } from "../clients.js";
import { clients } from "../clients.js";
import wa from "../whatsapp.js";

export const root = (req, res) => {
  res.json("Hello world!");
};

export const login = (req, res) => {
  if (status.whatsapp_authenticated) {
    return res.json("already authenticated");
  }
  res.json({
    image_src: status.whatsapp_qr_url,
  });
};

export const login_get = (req, res) => {
  const { client_id } = req.body;
  // if (status.whatsapp_authenticated) {
  //   return res.json("already authenticated");
  // }
  if (!client_id) {
    res.status(400);
    return res.json("client_id is required");
  }
  if (!clients[client_id]) {
    new wa(client_id);
    return res.json(`creating new client with id: ${client_id}`);
  }
  res.send(`<img src="${clients[client_id]?.qr ?? "x"}" />`);
};

export const logout = async (req, res) => {
  if (status.whatsapp_authenticated) {
    try {
      await whatsapp.logout();
      whatsapp.initialize();
      status.set_auth = false;
      status.set_qr = null;
      console.log("logout success");
      return res.json("Logout success");
    } catch (error) {
      res.status(500);
      return res.json("logout failed");
    }
  }
  res.status(401);
  res.json("Not authenticated");
};

export const send_message = async (req, res) => {
  // if (!status.whatsapp_authenticated) {
  //   res.status(401);
  //   return res.json("Not authenticated");
  // }

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
