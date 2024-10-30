// commands/admin/ping2.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('ping2')
    .setDescription('Replies with ping2!'),
  async execute(interaction) {
    await interaction.reply('Pong2!')
  },
}
