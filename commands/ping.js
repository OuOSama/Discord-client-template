const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Hello World')
  },
}
