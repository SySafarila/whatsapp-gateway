class Status {
  /**
   *
   * @param {string|null} whatsapp_qr_url
   * @param {boolean} whatsapp_authenticated
   */
  constructor(whatsapp_qr_url, whatsapp_authenticated) {
    this.whatsapp_qr_url = whatsapp_qr_url ?? null;
    this.whatsapp_authenticated = whatsapp_authenticated ?? false;
  }

  /**
   * @param {string|null} value
   */
  set set_qr(value) {
    this.whatsapp_qr_url = value;
  }

  /**
   * @param {boolean} value
   */
  set set_auth(value) {
    this.whatsapp_authenticated = value;
  }
}

export default Status;