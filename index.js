const { Client, Collection } = require("discord.js");
const client = new Client({ intents: [3276799] });

const config = require("./config.json");
const fs = require("fs");

client.commands = new Collection();
const files = fs.readdirSync("./commands").filter((f) => f.endsWith(".js"));

for (arx of files) {
  try {
    const endpoint = `./commands/${arx}`;
    const command = require(endpoint);

    client.commands.set(command.name, command);

    console.log(`${arx} cargado correctamente`);
  } catch (err) {
    console.log(err);
  }
}

client.on("messageCreate", async (message) => {
  const prefix = "!";
  if (!message.content.startsWith(prefix)) return null;

  if (message.content === "!deploy") {
    await message.guild.commands.set([
      {
        name: "donate",
        description: "Create lightning network Invoice",
        options: [
          {
            name: "sats",
            type: 3,
            description: "Amount of satoshis",
            required: true,
          },
        ],
      },
    ]);

    await message.reply("Deployed!");
  }
});

client.on("interactionCreate", async (interaction) => {
  const cmd = client.commands.get(interaction.commandName);

  if (cmd) {
    const args = [];

    for (let i = 0; i < cmd.args.length; i++) {
      const element = cmd.args[i];
      const argument = interaction.options.get(element).value;
      if (argument) args.push(interaction.options.get(element).value);
    }

    interaction.reply("Generando factura de lightning...");
    return cmd.run(client, interaction, args);
  }
});

client.login(config.token);
console.log("ready");
