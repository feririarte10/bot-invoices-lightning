const fetch = require("cross-fetch");
const lnurl = require("lnurl-pay");

class SDKCrypta {
  baseUrl = "https://wallet.lacrypta.ar";
  ADMIN_KEY = "";
  INVOICE_READ_KEY = "";

  constructor(config) {
    if (!config.ADMIN_KEY || !config.INVOICE_READ_KEY) {
      throw new Error("Need ADMIN_KEY and INVOICE_READ_KEY");
    }

    this.ADMIN_KEY = config.ADMIN_KEY;
    this.INVOICE_READ_KEY = config.INVOICE_READ_KEY;
  }

  call(endpoint, method, key, params = {}, extension = "") {
    const formattedUrl = `${this.baseUrl}/${
      extension ? `${extension}/api/v1` : "api/v1"
    }`;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": key,
      },
    };

    if (method !== "GET" && params) options.body = JSON.stringify(params);

    return fetch(`${formattedUrl}/${endpoint}`, options)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  walletDetails() {
    return this.call("wallet", "GET", this.INVOICE_READ_KEY);
  }

  createInvoice(invoiceConfig) {
    return this.call("payments", "POST", this.INVOICE_READ_KEY, invoiceConfig);
  }

  payInvoice(invoice) {
    return this.call("payments", "POST", this.ADMIN_KEY, {
      out: true,
      bolt11: invoice,
    });
  }

  getInvoiceStatus(paymentHash) {
    return this.call(`payments/${paymentHash}`, "GET", this.INVOICE_READ_KEY);
  }

  decodeInvoice(lnUrlOrBolt11) {
    return this.call("payments/decode", "POST", this.INVOICE_READ_KEY, {
      data: lnUrlOrBolt11,
    });
  }

  createOutgoingInvoice(lnUrlOrAddress, sats) {
    return lnurl
      .requestInvoice({
        lnUrlOrAddress,
        tokens: sats,
      })
      .then((invoice) => {
        return invoice;
      });
  }

  createPayLink(linkConfig) {
    return this.call("links", "POST", this.ADMIN_KEY, linkConfig, "lnurlp");
  }

  listPayLinks() {
    return this.call("links", "GET", this.INVOICE_READ_KEY, {}, "lnurlp");
  }

  getPayLink(payId) {
    return this.call(
      `links/${payId}`,
      "GET",
      this.INVOICE_READ_KEY,
      {},
      "lnurlp"
    );
  }

  updatePayLink(payId, updateConfig) {
    return this.call(
      `links/${payId}`,
      "PUT",
      this.ADMIN_KEY,
      {
        ...updateConfig,
        min: updateConfig.amount,
        max: updateConfig.amount,
      },
      "lnurlp"
    );
  }

  deletePayLink(payId) {
    return this.call(`links/${payId}`, "DELETE", this.ADMIN_KEY, {}, "lnurlp");
  }

  createUser(userConfig) {
    return this.call(
      "users",
      "POST",
      this.ADMIN_KEY,
      {
        ...userConfig,
        admin_id: this.ADMIN_KEY,
      },
      "usermanager"
    );
  }
}

module.exports = SDKCrypta;
