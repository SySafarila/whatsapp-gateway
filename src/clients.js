export let clients = [];

/**
 *
 * @param {string} client_id
 * @param {object} client Client object from wwebjs
 * @param {string|null} qr
 * @param {boolean} auth
 * @returns client object
 */
export const set_client = (client_id, client, qr = null, auth = false) => {
  clients[client_id] = { client, qr, auth };
  return clients[client_id];
};
