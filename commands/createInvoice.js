const { EmbedBuilder } = require("discord.js");
const googleQR = require("../externalAPIs/googleQR");
const requestInvoice = require("../externalAPIs/lnUrl");

module.exports = {
  name: "createInvoice",
  description: "Crea facturas de lightning network",

  run: (client, message, args) => {
    const address = args[0];
    const satsToSend = args[1];

    if (!address || !satsToSend) throw new Error("Send args");

    requestInvoice.createInvoice(address, satsToSend).then((invoice) => {
      if (invoice && invoice.invoice) {
        const QRUrl = googleQR.generateQR(invoice.invoice, 400, 400);

        const embed = new EmbedBuilder()
          .setTitle("Factura de Lightning")
          .setAuthor({
            name: "LNBot",
            iconURL:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Lightning_Network.svg/2048px-Lightning_Network.svg.png",
          })
          .setDescription(`${satsToSend} sats para ${address}`)
          .setImage(QRUrl);

        message.channel.send({
          embeds: [embed],
        });
      }
    });
  },
};
