const lnUrl = require("lnurl-pay");

module.exports = {
  createInvoice(lnUrlOrAddress, tokens) {
    if (!lnUrlOrAddress || !tokens)
      throw new Error("Send lnUrlOrAddress and tokens (amount)");

    return lnUrl
      .requestInvoice({
        lnUrlOrAddress,
        tokens,
      })
      .then((invoice) => invoice);
  },
};
