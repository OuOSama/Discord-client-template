// commands/ping.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('pinggggg')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!')
  },
}
