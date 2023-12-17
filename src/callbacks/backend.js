import { status, client as whatsapp } from "../clients.js";

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
  if (!status.whatsapp_authenticated) {
    res.status(401);
    return res.json("Not authenticated");
  }

  const { phone_number, message } = req.body;
  if (!phone_number || !message) {
    // validate requests
    res.status(400);
    return res.json("{phone_numnber} or {message} are required");
  }

  try {
    // sending message
    const send = await whatsapp.sendMessage(`${phone_number}@c.us`, message);
    console.log(`SEND STATUS: ${send.fromMe}`);
    return res.json(`SEND STATUS: ${send.fromMe}`);
  } catch (error) {
    res.status(400);
    return res.json(`Failed, error: ${error.message}`);
  }
};
