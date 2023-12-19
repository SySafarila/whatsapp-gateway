export let clients = [];

/**
 *
 * @param {string} client_id
 * @param {object} client Client object from wwebjs
 */
export const add_client = (client_id, client, qr, auth) => {
  clients[client_id] = { client, qr, auth };
};
