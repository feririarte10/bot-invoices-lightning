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

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const command = args.shift();
  const cmd = client.commands.get(command);

  if (cmd) cmd.run(client, message, args);
});

client.login(config.token);
console.log("ready");
