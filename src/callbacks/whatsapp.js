import QRCode from "qrcode";
// import { status, client as whatsapp } from "../clients.js";

// done
export const ready = () => {
  // the client is ready to send and receive messages
  console.log("Whatsapp client is ready!");
  whatsapp.setStatus("!ping");
};

// done
export const authenticated = () => {
  // the client is authenticated
  status.set_auth = true;
  console.log("Whatsapp client is authenticated!");
};

// done
export const disconnected = async (reason) => {
  // the client is disconnected
  console.log(`Client disconnected with reason: ${reason}`);
  status.set_qr = null;
  status.set_auth = false;
  whatsapp.initialize();
};

// done
export const qr = (qr) => {
  // the client is not authenticated and you can receive QRCode from '/login'
  QRCode.toDataURL(qr, (err, url) => {
    status.set_qr = url;
    status.set_auth = false;
  });
  console.log(`QR = ${qr}`);
};

// done
export const message = (message) => {
  // receiving message
  if (message.body == "!ping") {
    // reacting to received message
    message.react("👋");
  }
};
