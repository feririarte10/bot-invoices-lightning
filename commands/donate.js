const { EmbedBuilder } = require("discord.js");
const googleQR = require("../externalAPIs/googleQR");
// const requestInvoice = require("../externalAPIs/lnUrl");
const SDKCrypta = require("../externalAPIs/lnbits-sdk");

const sdk = new SDKCrypta({
  ADMIN_KEY: "",
  INVOICE_READ_KEY: "",
});

module.exports = {
  name: "donate",
  args: ["sats"],
  description: "Crea facturas de lightning network",

  run: (client, interaction, args) => {
    const address = "fer@hodl.ar";
    const satsToSend = args[0];

    if (!address || !satsToSend) throw new Error("Send args");

    sdk.createInvoice({ out: "false", amount: satsToSend }).then((invoice) => {
      if (invoice && invoice.payment_request) {
        const QRUrl = googleQR.generateQR(invoice.payment_request, 400, 400);

        const embed = new EmbedBuilder()
          .setTitle("Factura de Lightning")
          .setAuthor({
            name: "LNBot",
            iconURL:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Lightning_Network.svg/2048px-Lightning_Network.svg.png",
          })
          .setDescription(`${satsToSend} sats para ${address}`)
          .setImage(QRUrl);

        interaction.channel.send({
          embeds: [embed],
        });

        const checkInterval = setInterval(() => {
          sdk.getInvoiceStatus(invoice.payment_hash).then((result) => {
            if (result) {
              console.log(result.paid);

              if (result.paid) {
                clearInterval(checkInterval);

                sdk
                  .createOutgoingInvoice(address, result.details.amount / 1000)
                  .then((outgoing) => {
                    if (outgoing && outgoing.invoice) {
                      sdk.payInvoice(outgoing.invoice).then((result) => {
                        if (result) {
                          interaction.channel.send(
                            `La factura ha sido pagada! ${interaction.user.globalName} envió ${satsToSend} satoshis a ${address}!`
                          );
                        }
                      });
                    }
                  });
              }
            }
          });
        }, 2000);
      }
    });

    // requestInvoice.createInvoice(address, satsToSend).then((invoice) => {
    //   if (invoice && invoice.invoice) {
    //     const QRUrl = googleQR.generateQR(invoice.invoice, 400, 400);

    //     const embed = new EmbedBuilder()
    //       .setTitle("Factura de Lightning")
    //       .setAuthor({
    //         name: "LNBot",
    //         iconURL:
    //           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Lightning_Network.svg/2048px-Lightning_Network.svg.png",
    //       })
    //       .setDescription(`${satsToSend} sats para ${address}`)
    //       .setImage(QRUrl);

    //     interaction.channel.send({
    //       embeds: [embed],
    //     });
    //   }
    // });
  },
};
