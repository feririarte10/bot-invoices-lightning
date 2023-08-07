const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("Probando"),
  async execute(interaction) {
    console.log(interaction);
  },
};
